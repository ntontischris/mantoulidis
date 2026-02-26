'use client'

import Link from 'next/link'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'
import { useAuthStore } from '@/features/auth/store/authStore'

interface TopBarProps {
  locale: string
}

export function TopBar({ locale }: TopBarProps) {
  const profile = useAuthStore((s) => s.profile)
  const isSuperAdmin = profile?.role === 'super_admin'

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      {/* Mobile logo */}
      <Link href={`/${locale}`} className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          AC
        </div>
      </Link>

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Super-admin shortcut */}
        {isSuperAdmin && (
          <Link
            href={`/${locale}/admin/dashboard`}
            className="flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20"
          >
            <span aria-hidden>🛡️</span>
            Admin
          </Link>
        )}

        {/* Language switcher */}
        <Link
          href={locale === 'el' ? '/en' : '/el'}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {locale === 'el' ? 'EN' : 'ΕΛ'}
        </Link>

        {/* Notification bell with realtime badge */}
        <NotificationBell />

        {/* Profile link */}
        <Link
          href={`/${locale}/dashboard/profile`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
        >
          ?
        </Link>
      </div>
    </header>
  )
}
