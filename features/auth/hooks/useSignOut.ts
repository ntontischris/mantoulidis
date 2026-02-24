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
      reset()
      resetAnalytics()
      router.push(`/${locale}/login`)
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return { signOut, isPending }
}
