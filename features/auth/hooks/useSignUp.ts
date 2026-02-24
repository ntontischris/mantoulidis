'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Analytics } from '@/lib/analytics/events'
import type { SignUpFormData } from '../schemas/auth.schemas'

interface SignUpResult {
  error: string | null
  needsEmailConfirmation: boolean
}

export function useSignUp() {
  const [isPending, setIsPending] = useState(false)

  const signUp = async (data: SignUpFormData): Promise<SignUpResult> => {
    setIsPending(true)
    try {
      const supabase = createClient()
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            full_name: `${data.first_name} ${data.last_name}`,
          },
        },
      })

      if (error) {
        return {
          error: mapSignUpError(error.message),
          needsEmailConfirmation: false,
        }
      }

      const needsEmailConfirmation =
        authData.user?.identities?.length === 0
          ? false
          : !authData.session

      Analytics.auth.signUp('email')

      return { error: null, needsEmailConfirmation }
    } finally {
      setIsPending(false)
    }
  }

  return { signUp, isPending }
}

function mapSignUpError(message: string): string {
  if (message.includes('User already registered')) {
    return 'Υπάρχει ήδη λογαριασμός με αυτό το email'
  }
  if (message.includes('Password should be')) {
    return 'Ο κωδικός δεν πληροί τις απαιτήσεις ασφαλείας'
  }
  return 'Σφάλμα εγγραφής. Παρακαλώ δοκιμάστε ξανά'
}
