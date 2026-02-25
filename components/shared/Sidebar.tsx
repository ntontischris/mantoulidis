'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/features/auth/store/authStore'

interface NavItem {
  href: string
  label: string
  icon: string
}

function NavLink({ href, label, icon }: NavItem) {
  const pathname = usePathname()
  const isActive = pathname.includes(href)

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <span className="text-base" aria-hidden>
        {icon}
      </span>
      {label}
    </Link>
  )
}

export function Sidebar({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const base = `/${locale}/dashboard`
  const profile = useAuthStore((s) => s.profile)
  const isSuperAdmin = profile?.role === 'super_admin'

  const navItems: NavItem[] = [
    { href: `${base}/home`, label: t('home'), icon: '🏠' },
    { href: `${base}/news`, label: t('news'), icon: '📢' },
    { href: `${base}/directory`, label: t('directory'), icon: '👥' },
    { href: `${base}/businesses`, label: t('businesses'), icon: '🏢' },
    { href: `${base}/benefits`, label: t('benefits'), icon: '🎁' },
    { href: `${base}/events`, label: t('events'), icon: '📅' },
    { href: `${base}/gallery`, label: t('gallery'), icon: '🖼️' },
    { href: `${base}/jobs`, label: t('jobs'), icon: '💼' },
    { href: `${base}/mentorship`, label: t('mentorship'), icon: '🤝' },
    { href: `${base}/messages`, label: t('messages'), icon: '💬' },
    { href: `${base}/groups`, label: t('groups'), icon: '🏘️' },
  ]

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            AC
          </div>
          <span className="font-semibold text-foreground">Alumni Connect</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </nav>

      {/* Profile section */}
      <div className="border-t border-border p-4">
        <NavLink href={`/${locale}/dashboard/profile`} label={t('profile')} icon="👤" />
        <NavLink href={`/${locale}/settings`} label={t('settings')} icon="⚙️" />
        {isSuperAdmin && (
          <Link
            href={`/${locale}/admin/dashboard`}
            className="mt-3 flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20"
          >
            <span className="text-base" aria-hidden>
              🛡️
            </span>
            Admin Panel
          </Link>
        )}
      </div>
    </aside>
  )
}
