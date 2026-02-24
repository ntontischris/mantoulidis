import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Session, User } from '@supabase/supabase-js'
import type { Tables } from '@/lib/supabase/types'

type Profile = Tables<'profiles'>

interface AuthState {
  // State
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isInitialized: boolean

  // Setters
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (isLoading: boolean) => void
  setInitialized: (isInitialized: boolean) => void

  // Computed helpers
  isAuthenticated: () => boolean
  isAdmin: () => boolean
  isVerifiedMember: () => boolean
  isActiveMember: () => boolean
  needsOnboarding: () => boolean

  // Reset
  reset: () => void
}

const initialState = {
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isInitialized: false,
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),

      isAuthenticated: () => !!get().session && !!get().user,

      isAdmin: () => {
        const role = get().profile?.role
        return role === 'admin' || role === 'super_admin'
      },

      isVerifiedMember: () => {
        const role = get().profile?.role
        return (
          role === 'verified_member' ||
          role === 'admin' ||
          role === 'super_admin'
        )
      },

      isActiveMember: () => {
        return get().profile?.membership_status === 'active'
      },

      needsOnboarding: () => {
        const profile = get().profile
        return !!get().user && !!profile && !profile.onboarding_completed
      },

      reset: () => set({ ...initialState, isLoading: false, isInitialized: true }),
    }),
    { name: 'auth-store' },
  ),
)
