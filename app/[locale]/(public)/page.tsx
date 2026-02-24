import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.hero' })
  return { title: t('title') }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="mb-4 text-display font-extrabold text-primary">
          {t('hero.title')}
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">{t('hero.subtitle')}</p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}/register`}
            className="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t('hero.joinButton')}
          </Link>
          <Link
            href={`/${locale}/dashboard/directory`}
            className="rounded-lg border border-border px-8 py-3 font-medium text-foreground transition-colors hover:bg-muted"
          >
            {t('hero.exploreButton')}
          </Link>
        </div>
      </div>
    </main>
  )
}
