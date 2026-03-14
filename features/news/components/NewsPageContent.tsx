'use client'

import { useState } from 'react'
import { useAnnouncements, useSuccessStories, usePolls } from '@/features/news/hooks/useNews'
import { AnnouncementCard } from '@/features/news/components/AnnouncementCard'
import { SuccessStoryCard } from '@/features/news/components/SuccessStoryCard'
import { PollCard } from '@/features/news/components/PollCard'

type Tab = 'announcements' | 'stories' | 'polls'

interface NewsPageContentProps {
  locale: string
}

function NewsEmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <p className="text-3xl">{icon}</p>
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export function NewsPageContent({ locale }: NewsPageContentProps) {
  const [tab, setTab] = useState<Tab>('announcements')

  const { data: announcements, isLoading: loadingAnn } = useAnnouncements()
  const { data: stories, isLoading: loadingStories } = useSuccessStories()
  const { data: polls, isLoading: loadingPolls } = usePolls()

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'announcements', label: 'Ανακοινώσεις', count: announcements?.length },
    { id: 'stories', label: 'Ιστορίες', count: stories?.length },
    { id: 'polls', label: 'Δημοσκοπήσεις', count: polls?.length },
  ]

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Νέα & Ενημερώσεις</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ανακοινώσεις, ιστορίες επιτυχίας και δημοσκοπήσεις
        </p>
      </div>

      {/* Tabs */}
      <div className="flex w-fit gap-1 rounded-xl bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'announcements' && (
        <div className="max-w-2xl space-y-4">
          {loadingAnn ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
            ))
          ) : announcements && announcements.length > 0 ? (
            announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} locale={locale} />
            ))
          ) : (
            <NewsEmptyState icon="📢" text="Δεν υπάρχουν ανακοινώσεις ακόμα" />
          )}
        </div>
      )}

      {tab === 'stories' && (
        <div className="grid max-w-4xl gap-4 sm:grid-cols-2">
          {loadingStories ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
            ))
          ) : stories && stories.length > 0 ? (
            stories.map((s) => <SuccessStoryCard key={s.id} story={s} locale={locale} />)
          ) : (
            <div className="sm:col-span-2">
              <NewsEmptyState icon="🌟" text="Δεν υπάρχουν ιστορίες επιτυχίας ακόμα" />
            </div>
          )}
        </div>
      )}

      {tab === 'polls' && (
        <div className="max-w-lg space-y-4">
          {loadingPolls ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
            ))
          ) : polls && polls.length > 0 ? (
            polls.map((p) => <PollCard key={p.id} poll={p} locale={locale} />)
          ) : (
            <NewsEmptyState icon="📊" text="Δεν υπάρχουν ενεργές δημοσκοπήσεις" />
          )}
        </div>
      )}
    </div>
  )
}
