'use client'

import Link from 'next/link'
import { JOB_TYPE_LABELS } from '../types'
import { SavedJobButton } from './SavedJobButton'
import type { Job } from '../types'

interface JobCardProps {
  job: Job
  locale: string
}

export function JobCard({ job, locale }: JobCardProps) {
  const title = locale === 'en' && job.title_en ? job.title_en : job.title
  const isExpired = job.expires_at ? new Date(job.expires_at) < new Date() : false

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/${locale}/dashboard/jobs/${job.id}`}
            className="font-semibold text-foreground hover:text-primary line-clamp-2"
          >
            {title}
          </Link>
          <p className="mt-0.5 text-sm text-muted-foreground">{job.company}</p>
        </div>
        <SavedJobButton jobId={job.id} isSaved={job.is_saved ?? false} />
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {JOB_TYPE_LABELS[job.type]}
        </span>
        {job.is_remote && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Remote
          </span>
        )}
        {job.location && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            📍 {job.location}
          </span>
        )}
        {job.salary_range && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            💰 {job.salary_range}
          </span>
        )}
        {isExpired && (
          <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
            Έληξε
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span>
          {job.poster
            ? `${job.poster.first_name} ${job.poster.last_name}`
            : 'Alumni Connect'}
        </span>
        <span>{new Date(job.created_at).toLocaleDateString('el-GR')}</span>
      </div>
    </div>
  )
}
