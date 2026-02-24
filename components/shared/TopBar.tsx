'use client'

import Link from 'next/link'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'

interface TopBarProps {
  locale: string
}

export function TopBar({ locale }: TopBarProps) {
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
