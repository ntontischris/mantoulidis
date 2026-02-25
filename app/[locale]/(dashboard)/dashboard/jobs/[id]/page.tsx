'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useJob, useDeleteJob } from '@/features/jobs/hooks/useJobs'
import { SavedJobButton } from '@/features/jobs/components/SavedJobButton'
import { JOB_TYPE_LABELS } from '@/features/jobs/types'

export default function JobDetailPage() {
  const { locale, id } = useParams<{ locale: string; id: string }>()
  const router = useRouter()
  const { data: job, isLoading } = useJob(id)
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob()

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <div className="h-8 w-1/2 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded-lg bg-muted" />
        <div className="mt-6 h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
        <p className="text-4xl">💼</p>
        <p>Η αγγελία δεν βρέθηκε</p>
        <Link href={`/${locale}/dashboard/jobs`} className="text-sm text-primary hover:underline">
          ← Πίσω στις αγγελίες
        </Link>
      </div>
    )
  }

  const title = locale === 'en' && job.title_en ? job.title_en : job.title
  const description = locale === 'en' && job.description_en ? job.description_en : job.description
  const isExpired = job.expires_at ? new Date(job.expires_at) < new Date() : false

  function handleDelete() {
    if (!confirm('Να διαγραφεί η αγγελία;')) return
    deleteJob(job!.id, {
      onSuccess: () => router.push(`/${locale}/dashboard/jobs`),
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      {/* Back link */}
      <Link href={`/${locale}/dashboard/jobs`} className="text-sm text-muted-foreground hover:text-foreground">
        ← Πίσω στις αγγελίες
      </Link>

      {/* Header card */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-1 text-lg text-muted-foreground">{job.company}</p>
          </div>
          <SavedJobButton jobId={job.id} isSaved={job.is_saved ?? false} />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {JOB_TYPE_LABELS[job.type]}
          </span>
          {job.is_remote && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Remote
            </span>
          )}
          {isExpired && (
            <span className="rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
              Έληξε
            </span>
          )}
        </div>

        {/* Meta info */}
        <dl className="grid gap-2 sm:grid-cols-2 text-sm">
          {job.location && (
            <div>
              <dt className="text-muted-foreground">Τοποθεσία</dt>
              <dd className="font-medium">📍 {job.location}</dd>
            </div>
          )}
          {job.salary_range && (
            <div>
              <dt className="text-muted-foreground">Αμοιβή</dt>
              <dd className="font-medium">💰 {job.salary_range}</dd>
            </div>
          )}
          {job.industry && (
            <div>
              <dt className="text-muted-foreground">Κλάδος</dt>
              <dd className="font-medium">{job.industry}</dd>
            </div>
          )}
          {job.expires_at && (
            <div>
              <dt className="text-muted-foreground">Λήξη</dt>
              <dd className="font-medium">{new Date(job.expires_at).toLocaleDateString('el-GR')}</dd>
            </div>
          )}
        </dl>

        {/* Apply buttons */}
        {(job.apply_url || job.apply_email) && (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
            {job.apply_url && (
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Υποβολή αίτησης →
              </a>
            )}
            {job.apply_email && (
              <a
                href={`mailto:${job.apply_email}`}
                className="rounded-lg border border-border px-5 py-2 text-sm font-semibold hover:bg-muted"
              >
                ✉️ {job.apply_email}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-3 font-semibold text-foreground">Περιγραφή</h2>
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm text-muted-foreground">
            {description}
          </div>
        </div>
      )}

      {/* Posted by */}
      {job.poster && (
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {job.poster.first_name[0]}
          </div>
          <div>
            <p className="text-sm font-medium">{job.poster.first_name} {job.poster.last_name}</p>
            <Link
              href={`/${locale}/dashboard/directory/${job.poster.id}`}
              className="text-xs text-primary hover:underline"
            >
              Προβολή προφίλ
            </Link>
          </div>
        </div>
      )}

      {/* Owner actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
        >
          Διαγραφή
        </button>
      </div>
    </div>
  )
}
