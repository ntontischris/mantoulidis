import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/features/auth/store/authStore'

// Reset store state between tests
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isInitialized: false,
  })
})

describe('useAuthStore', () => {
  it('initializes with default state', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
    expect(state.profile).toBeNull()
    expect(state.isLoading).toBe(true)
    expect(state.isInitialized).toBe(false)
  })

  it('isAuthenticated returns false when no session', () => {
    expect(useAuthStore.getState().isAuthenticated()).toBe(false)
  })

  it('isAuthenticated returns true when session and user set', () => {
    useAuthStore.setState({
      user: { id: 'user-1' } as never,
      session: { access_token: 'tok' } as never,
    })
    expect(useAuthStore.getState().isAuthenticated()).toBe(true)
  })

  it('isAdmin returns true for admin role', () => {
    useAuthStore.setState({
      profile: { role: 'admin' } as never,
    })
    expect(useAuthStore.getState().isAdmin()).toBe(true)
  })

  it('isAdmin returns true for super_admin role', () => {
    useAuthStore.setState({ profile: { role: 'super_admin' } as never })
    expect(useAuthStore.getState().isAdmin()).toBe(true)
  })

  it('isAdmin returns false for basic_member', () => {
    useAuthStore.setState({ profile: { role: 'basic_member' } as never })
    expect(useAuthStore.getState().isAdmin()).toBe(false)
  })

  it('isVerifiedMember returns true for verified_member', () => {
    useAuthStore.setState({ profile: { role: 'verified_member' } as never })
    expect(useAuthStore.getState().isVerifiedMember()).toBe(true)
  })

  it('isActiveMember returns true when membership_status is active', () => {
    useAuthStore.setState({ profile: { membership_status: 'active' } as never })
    expect(useAuthStore.getState().isActiveMember()).toBe(true)
  })

  it('needsOnboarding returns true when profile.onboarding_completed is false', () => {
    useAuthStore.setState({
      user: { id: 'u1' } as never,
      profile: { onboarding_completed: false } as never,
    })
    expect(useAuthStore.getState().needsOnboarding()).toBe(true)
  })

  it('needsOnboarding returns false when onboarding_completed is true', () => {
    useAuthStore.setState({
      user: { id: 'u1' } as never,
      profile: { onboarding_completed: true } as never,
    })
    expect(useAuthStore.getState().needsOnboarding()).toBe(false)
  })

  it('reset clears user, session, profile', () => {
    useAuthStore.setState({
      user: { id: 'u1' } as never,
      session: { access_token: 'tok' } as never,
      profile: { id: 'u1' } as never,
    })
    useAuthStore.getState().reset()
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
    expect(state.profile).toBeNull()
    expect(state.isLoading).toBe(false)
    expect(state.isInitialized).toBe(true)
  })
})
