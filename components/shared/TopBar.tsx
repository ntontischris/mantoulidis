'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'
import { useAuthStore } from '@/features/auth/store/authStore'

interface TopBarProps {
  locale: string
}

export function TopBar({ locale }: TopBarProps) {
  const t = useTranslations('nav')
  const profile = useAuthStore((s) => s.profile)
  const isSuperAdmin = profile?.role === 'super_admin'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isAdmin = pathname.includes('/admin/')

  const dashboardNavItems = [
    { href: `/${locale}/dashboard/home`, label: t('home'), icon: '🏠' },
    { href: `/${locale}/dashboard/news`, label: t('news'), icon: '📢' },
    { href: `/${locale}/dashboard/directory`, label: t('directory'), icon: '👥' },
    { href: `/${locale}/dashboard/businesses`, label: t('businesses'), icon: '🏢' },
    { href: `/${locale}/dashboard/benefits`, label: t('benefits'), icon: '🎁' },
    { href: `/${locale}/dashboard/events`, label: t('events'), icon: '📅' },
    { href: `/${locale}/dashboard/gallery`, label: t('gallery'), icon: '🖼️' },
    { href: `/${locale}/dashboard/jobs`, label: t('jobs'), icon: '💼' },
    { href: `/${locale}/dashboard/mentorship`, label: t('mentorship'), icon: '🤝' },
    { href: `/${locale}/dashboard/messages`, label: t('messages'), icon: '💬' },
    { href: `/${locale}/dashboard/groups`, label: t('groups'), icon: '🏘️' },
    { href: `/${locale}/dashboard/profile`, label: t('profile'), icon: '👤' },
  ]

  const adminNavItems = [
    { href: `/${locale}/admin/dashboard`, label: 'Dashboard', icon: '📊' },
    { href: `/${locale}/admin/users`, label: 'Χρήστες', icon: '👥' },
    { href: `/${locale}/admin/news`, label: 'Νέα & Polls', icon: '📢' },
    { href: `/${locale}/admin/benefits`, label: 'Παροχές', icon: '🎁' },
    { href: `/${locale}/admin/events`, label: 'Εκδηλώσεις', icon: '📅' },
    { href: `/${locale}/admin/jobs`, label: 'Αγγελίες', icon: '💼' },
    { href: `/${locale}/admin/gallery`, label: 'Gallery', icon: '🖼️' },
    { href: `/${locale}/admin/groups`, label: 'Ομάδες', icon: '🏘️' },
    { href: `/${locale}/admin/moderation`, label: 'Moderation', icon: '🛡️' },
  ]

  const navItems = isAdmin ? adminNavItems : dashboardNavItems

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
        {/* Mobile menu button + logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            )}
          </button>
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              AC
            </div>
          </Link>
        </div>

        {/* Desktop spacer */}
        <div className="hidden lg:block" />

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Super-admin shortcut */}
          {isSuperAdmin && (
            <Link
              href={`/${locale}/admin/dashboard`}
              className="hidden sm:flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20"
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

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-card border-r border-border shadow-xl lg:hidden">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Link href={`/${locale}`} className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  AC
                </div>
                <span className="font-semibold text-foreground">
                  {isAdmin ? 'Admin Panel' : 'Alumni Connect'}
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname.includes(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span className="text-base" aria-hidden>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </>
      )}
    </>
  )
}
