'use client'

import type { AnnouncementRow } from '@/lib/supabase/types'

interface AnnouncementCardProps {
  announcement: AnnouncementRow
  locale: string
}

const TYPE_COLORS: Record<string, string> = {
  general: 'bg-primary/10 text-primary',
  event: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  achievement: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  opportunity: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

const TYPE_LABELS: Record<string, string> = {
  general: 'Ανακοίνωση',
  event: 'Εκδήλωση',
  achievement: 'Επίτευγμα',
  opportunity: 'Ευκαιρία',
}

export function AnnouncementCard({ announcement, locale }: AnnouncementCardProps) {
  const title = locale === 'en' && announcement.title_en ? announcement.title_en : announcement.title
  const body = locale === 'en' && announcement.body_en ? announcement.body_en : announcement.body

  return (
    <article className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[announcement.type] ?? TYPE_COLORS.general}`}
          >
            {TYPE_LABELS[announcement.type] ?? announcement.type}
          </span>
          <h3 className="font-semibold text-foreground leading-snug">{title}</h3>
        </div>
        <time className="shrink-0 text-xs text-muted-foreground">
          {announcement.published_at
            ? new Date(announcement.published_at).toLocaleDateString('el-GR')
            : new Date(announcement.created_at).toLocaleDateString('el-GR')}
        </time>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">{body}</p>
    </article>
  )
}
