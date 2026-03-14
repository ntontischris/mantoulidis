'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PageHeader } from '@/components/shared/PageHeader'
import { useEvents } from '@/features/events/hooks/useEvents'
import { useBenefits } from '@/features/benefits/hooks/useBenefits'
import { useAnnouncements, useSuccessStories } from '@/features/news/hooks/useNews'
import { BENEFIT_CATEGORIES } from '@/features/benefits/types'

const STAT_KEYS = ['members', 'businesses', 'events', 'benefits'] as const

function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const supabase = createClient()
      const [{ count: members }, { count: businesses }, { count: events }, { count: benefits }] =
        await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase
            .from('businesses')
            .select('id', { count: 'exact', head: true })
            .eq('is_active', true),
          supabase
            .from('events')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'published'),
          supabase
            .from('benefits')
            .select('id', { count: 'exact', head: true })
            .eq('is_active', true),
        ])
      return {
        members: members ?? 0,
        businesses: businesses ?? 0,
        events: events ?? 0,
        benefits: benefits ?? 0,
      }
    },
    staleTime: 60_000,
  })
}

function formatShortDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale === 'el' ? 'el-GR' : 'en-US', {
    day: 'numeric',
    month: 'short',
  })
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('el-GR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function SectionSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return <p className="py-8 text-center text-sm text-muted-foreground">{message}</p>
}

export function DashboardHomeContent() {
  const t = useTranslations('home')
  const { locale } = useParams<{ locale: string }>()

  const stats = useDashboardStats()
  const { data: upcomingEvents = [], isLoading: eventsLoading } = useEvents({ upcoming: true })
  const { data: activeBenefits = [], isLoading: benefitsLoading } = useBenefits()
  const { data: announcements = [], isLoading: newsLoading } = useAnnouncements()
  const { data: stories = [], isLoading: storiesLoading } = useSuccessStories()

  return (
    <div className="space-y-6">
      <PageHeader title={t('hero.title')} subtitle={t('hero.subtitle')} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_KEYS.map((stat) => (
          <div key={stat} className="card-base text-center">
            <p className="text-2xl font-bold text-primary">
              {stats.isLoading ? '...' : (stats.data?.[stat] ?? 0)}
            </p>
            <p className="text-sm text-muted-foreground">{t(`stats.${stat}`)}</p>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <section className="card-base">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">{t('sections.upcomingEvents')}</h2>
            <Link
              href={`/${locale}/dashboard/events`}
              className="text-sm text-primary hover:underline"
            >
              {t('viewAll')}
            </Link>
          </div>
          {eventsLoading ? (
            <SectionSkeleton />
          ) : upcomingEvents.length === 0 ? (
            <EmptyState message={t('empty.events')} />
          ) : (
            <div className="space-y-3">
              {upcomingEvents.slice(0, 3).map((event) => (
                <Link
                  key={event.id}
                  href={`/${locale}/dashboard/events/${event.id}`}
                  className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border border-border p-3 transition-colors"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-xs font-medium leading-none">
                      {formatShortDate(event.start_date, locale).split(' ')[0]}
                    </span>
                    <span className="mt-0.5 text-[10px] uppercase leading-none">
                      {formatShortDate(event.start_date, locale).split(' ')[1]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(event.start_date)}
                      {event.location && ` · ${event.location}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {event.rsvp_count}
                    {event.capacity ? `/${event.capacity}` : ''}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Featured Benefits */}
        <section className="card-base">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">{t('sections.featuredBenefits')}</h2>
            <Link
              href={`/${locale}/dashboard/benefits`}
              className="text-sm text-primary hover:underline"
            >
              {t('viewAll')}
            </Link>
          </div>
          {benefitsLoading ? (
            <SectionSkeleton />
          ) : activeBenefits.length === 0 ? (
            <EmptyState message={t('empty.benefits')} />
          ) : (
            <div className="space-y-3">
              {activeBenefits.slice(0, 3).map((benefit) => {
                const categoryLabel =
                  BENEFIT_CATEGORIES.find((c) => c.value === benefit.category)?.label ??
                  benefit.category
                return (
                  <Link
                    key={benefit.id}
                    href={`/${locale}/dashboard/benefits/${benefit.id}`}
                    className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border border-border p-3 transition-colors"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                      {benefit.partner_name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {benefit.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {benefit.partner_name} · {categoryLabel}
                      </p>
                    </div>
                    {benefit.discount_text && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {benefit.discount_text}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* Latest News */}
        <section className="card-base">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">{t('sections.latestNews')}</h2>
            <Link
              href={`/${locale}/dashboard/news`}
              className="text-sm text-primary hover:underline"
            >
              {t('viewAll')}
            </Link>
          </div>
          {newsLoading ? (
            <SectionSkeleton />
          ) : announcements.length === 0 ? (
            <EmptyState message={t('empty.news')} />
          ) : (
            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => {
                const title = locale === 'en' && ann.title_en ? ann.title_en : ann.title
                return (
                  <div key={ann.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-1 text-sm font-medium text-foreground">{title}</p>
                      <time className="shrink-0 text-xs text-muted-foreground">
                        {formatShortDate(ann.published_at ?? ann.created_at, locale)}
                      </time>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {locale === 'en' && ann.body_en ? ann.body_en : ann.body}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Alumni Spotlight */}
        <section className="card-base">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">{t('sections.spotlight')}</h2>
            <Link
              href={`/${locale}/dashboard/news`}
              className="text-sm text-primary hover:underline"
            >
              {t('viewAll')}
            </Link>
          </div>
          {storiesLoading ? (
            <SectionSkeleton />
          ) : stories.length === 0 ? (
            <EmptyState message={t('empty.spotlight')} />
          ) : (
            <div className="space-y-3">
              {stories.slice(0, 2).map((story) => {
                const title = locale === 'en' && story.title_en ? story.title_en : story.title
                const content =
                  locale === 'en' && story.content_en ? story.content_en : story.content
                return (
                  <div key={story.id} className="rounded-lg border border-border p-3">
                    {story.author && (
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                          {story.author.first_name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {story.author.first_name} {story.author.last_name}
                          </p>
                        </div>
                      </div>
                    )}
                    <p className="text-sm font-medium text-foreground">{title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{content}</p>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
