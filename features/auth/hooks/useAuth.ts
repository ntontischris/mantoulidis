'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '../store/authStore'

/**
 * Initializes and syncs auth state from Supabase.
 * Call once at the root layout level.
 */
export function useAuthInit() {
  const { setUser, setSession, setProfile, setLoading, setInitialized, reset } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(profile)
      }

      setLoading(false)
      setInitialized(true)
    })

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(profile)
      } else {
        reset()
      }

      setLoading(false)
      setInitialized(true)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setSession, setProfile, setLoading, setInitialized, reset])
}

/**
 * Returns current auth state without triggering side effects.
 */
export function useAuth() {
  return useAuthStore()
}
