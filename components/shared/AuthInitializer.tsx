'use client'

import { useAuthInit } from '@/features/auth/hooks/useAuth'

export function AuthInitializer() {
  useAuthInit()
  return null
}
