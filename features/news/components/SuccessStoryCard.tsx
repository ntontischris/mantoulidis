'use client'

import type { SuccessStoryWithAuthor } from '../hooks/useNews'

interface SuccessStoryCardProps {
  story: SuccessStoryWithAuthor
  locale: string
}

export function SuccessStoryCard({ story, locale }: SuccessStoryCardProps) {
  const title = locale === 'en' && story.title_en ? story.title_en : story.title
  const content = locale === 'en' && story.content_en ? story.content_en : story.content

  return (
    <article className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Author */}
      {story.author && (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
            {story.author.first_name[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {story.author.first_name} {story.author.last_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(story.created_at).toLocaleDateString('el-GR')}
            </p>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-5 whitespace-pre-wrap">{content}</p>
      </div>
    </article>
  )
}
