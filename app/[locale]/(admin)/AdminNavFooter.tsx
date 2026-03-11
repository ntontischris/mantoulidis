'use client'

import Link from 'next/link'
import { useSignOut } from '@/features/auth/hooks/useSignOut'

export function AdminNavFooter({ locale }: { locale: string }) {
  const { signOut, isPending } = useSignOut(locale)

  return (
    <div className="space-y-1 border-t border-border p-3">
      <Link
        href={`/${locale}/dashboard/home`}
        className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        ← Dashboard
      </Link>
      <Link
        href={`/${locale}`}
        className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        🏛️ Αρχική Σελίδα
      </Link>
      <button
        onClick={signOut}
        disabled={isPending}
        className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
      >
        🚪 {isPending ? 'Αποσύνδεση...' : 'Αποσύνδεση'}
      </button>
    </div>
  )
}
