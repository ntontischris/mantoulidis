import { TopBar } from '@/components/shared/TopBar'
import Link from 'next/link'

const adminNavItems = [
  { href: 'dashboard', label: 'Dashboard' },
  { href: 'users', label: 'Χρήστες' },
  { href: 'moderation', label: 'Moderation' },
]

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Admin sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive text-xs font-bold text-white">
            A
          </div>
          <span className="font-semibold text-sm text-foreground">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}/admin/${item.href}`}
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border">
            <Link
              href={`/${locale}/dashboard`}
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              ← Dashboard
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar locale={locale} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
