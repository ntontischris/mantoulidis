import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/PageHeader'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return { title: t('home') }
}

export default function DashboardHomePage() {
  const t = useTranslations('home')

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
      />

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(['members', 'businesses', 'events', 'benefits'] as const).map((stat) => (
          <div key={stat} className="card-base text-center">
            <p className="text-2xl font-bold text-primary">—</p>
            <p className="text-sm text-muted-foreground">{t(`stats.${stat}`)}</p>
          </div>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card-base">
          <h2 className="mb-3 font-semibold text-foreground">{t('sections.upcomingEvents')}</h2>
          <p className="text-sm text-muted-foreground">Sprint 9 — Events system</p>
        </div>
        <div className="card-base">
          <h2 className="mb-3 font-semibold text-foreground">{t('sections.featuredBenefits')}</h2>
          <p className="text-sm text-muted-foreground">Sprint 7 — Benefits system</p>
        </div>
        <div className="card-base">
          <h2 className="mb-3 font-semibold text-foreground">{t('sections.latestNews')}</h2>
          <p className="text-sm text-muted-foreground">Sprint 17 — News feed</p>
        </div>
        <div className="card-base">
          <h2 className="mb-3 font-semibold text-foreground">{t('sections.spotlight')}</h2>
          <p className="text-sm text-muted-foreground">Sprint 17 — Success stories</p>
        </div>
      </div>
    </div>
  )
}
