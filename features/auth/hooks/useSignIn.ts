'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Analytics } from '@/lib/analytics/events'
import type { SignInFormData } from '../schemas/auth.schemas'

interface SignInResult {
  error: string | null
}

export function useSignIn(locale: string) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const signIn = async (data: SignInFormData): Promise<SignInResult> => {
    setIsPending(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        return { error: mapAuthError(error.message) }
      }

      Analytics.auth.signIn('email')
      router.push(`/${locale}/dashboard/home`)
      router.refresh()
      return { error: null }
    } finally {
      setIsPending(false)
    }
  }

  const signInWithGoogle = async (): Promise<SignInResult> => {
    setIsPending(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/${locale}/dashboard/home`,
        },
      })

      if (error) {
        return { error: mapAuthError(error.message) }
      }

      Analytics.auth.signIn('google')
      return { error: null }
    } finally {
      setIsPending(false)
    }
  }

  const signInWithMagicLink = async (email: string): Promise<SignInResult> => {
    setIsPending(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/${locale}/dashboard/home`,
        },
      })

      if (error) {
        return { error: mapAuthError(error.message) }
      }

      Analytics.auth.signIn('magic_link')
      return { error: null }
    } finally {
      setIsPending(false)
    }
  }

  return { signIn, signInWithGoogle, signInWithMagicLink, isPending }
}

// ---- helpers ----

function mapAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Λάθος email ή κωδικός'
  }
  if (message.includes('Email not confirmed')) {
    return 'Παρακαλώ επιβεβαιώστε το email σας πριν συνδεθείτε'
  }
  if (message.includes('Too many requests')) {
    return 'Πολλές αποτυχημένες προσπάθειες. Δοκιμάστε ξανά σε λίγο'
  }
  return 'Σφάλμα σύνδεσης. Παρακαλώ δοκιμάστε ξανά'
}
