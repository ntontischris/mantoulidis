import { Sidebar } from '@/components/shared/Sidebar'
import { TopBar } from '@/components/shared/TopBar'
import { AuthInitializer } from '@/components/shared/AuthInitializer'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AuthInitializer />
      <Sidebar locale={locale} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar locale={locale} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
