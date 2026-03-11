'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { resetAnalytics } from '@/lib/analytics/posthog'
import { useAuthStore } from '../store/authStore'

export function useSignOut(locale: string) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const reset = useAuthStore((s) => s.reset)

  const signOut = async () => {
    setIsPending(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
      // ignore sign-out errors — clear state and redirect anyway
    } finally {
      reset()
      try {
        resetAnalytics()
      } catch {}
      setIsPending(false)
      router.push(`/${locale}/login`)
      router.refresh()
    }
  }

  return { signOut, isPending }
}
