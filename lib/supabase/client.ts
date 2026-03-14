import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

// No-op lock to bypass navigator.locks 10s timeout deadlocks in dev/HMR
const noopLock = async (_name: string, _acquireTimeout: number, fn: () => Promise<unknown>) => {
  return await fn()
}

// Singleton browser client — call this in Client Components
export function createClient() {
  return createBrowserClient<Database>(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      auth: { lock: noopLock } as Record<string, unknown>,
    }
  )
}
