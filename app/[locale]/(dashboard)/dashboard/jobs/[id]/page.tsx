import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SavedJobButton } from '@/features/jobs/components/SavedJobButton'
import { DeleteJobButton } from '@/features/jobs/components/DeleteJobButton'
import { JOB_TYPE_LABELS } from '@/features/jobs/types'

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: jobData } = await supabase
    .from('jobs')
    .select('*, poster:posted_by(id, first_name, last_name, avatar_url)')
    .eq('id', id)
    .single()
  if (!jobData) notFound()

  const poster = Array.isArray(jobData.poster) ? jobData.poster[0] : jobData.poster

  const { data: savedRow } = await supabase
    .from('saved_jobs')
    .select('job_id')
    .eq('user_id', user.id)
    .eq('job_id', id)
    .maybeSingle()

  const isSaved = !!savedRow
  const isOwner = user.id === jobData.posted_by

  const title = locale === 'en' && jobData.title_en ? jobData.title_en : jobData.title
  const description =
    locale === 'en' && jobData.description_en ? jobData.description_en : jobData.description
  const isExpired = jobData.expires_at ? new Date(jobData.expires_at) < new Date() : false

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      {/* Back link */}
      <Link
        href={`/${locale}/dashboard/jobs`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Πίσω στις αγγελίες
      </Link>

      {/* Header card */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-1 text-lg text-muted-foreground">{jobData.company}</p>
          </div>
          <SavedJobButton jobId={jobData.id} isSaved={isSaved} />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {JOB_TYPE_LABELS[jobData.type]}
          </span>
          {jobData.is_remote && (
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
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          {jobData.location && (
            <div>
              <dt className="text-muted-foreground">Τοποθεσία</dt>
              <dd className="font-medium">📍 {jobData.location}</dd>
            </div>
          )}
          {jobData.salary_range && (
            <div>
              <dt className="text-muted-foreground">Αμοιβή</dt>
              <dd className="font-medium">💰 {jobData.salary_range}</dd>
            </div>
          )}
          {jobData.industry && (
            <div>
              <dt className="text-muted-foreground">Κλάδος</dt>
              <dd className="font-medium">{jobData.industry}</dd>
            </div>
          )}
          {jobData.expires_at && (
            <div>
              <dt className="text-muted-foreground">Λήξη</dt>
              <dd className="font-medium">
                {new Date(jobData.expires_at).toLocaleDateString('el-GR')}
              </dd>
            </div>
          )}
        </dl>

        {/* Apply buttons */}
        {(jobData.apply_url || jobData.apply_email) && (
          <div className="flex flex-wrap gap-3 border-t border-border pt-2">
            {jobData.apply_url && (
              <a
                href={jobData.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Υποβολή αίτησης →
              </a>
            )}
            {jobData.apply_email && (
              <a
                href={`mailto:${jobData.apply_email}`}
                className="rounded-lg border border-border px-5 py-2 text-sm font-semibold hover:bg-muted"
              >
                ✉️ {jobData.apply_email}
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
      {poster && (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {poster.first_name[0]}
          </div>
          <div>
            <p className="text-sm font-medium">
              {poster.first_name} {poster.last_name}
            </p>
            <Link
              href={`/${locale}/dashboard/directory/${poster.id}`}
              className="text-xs text-primary hover:underline"
            >
              Προβολή προφίλ
            </Link>
          </div>
        </div>
      )}

      {/* Owner actions */}
      {isOwner && (
        <div className="flex justify-end gap-3">
          <DeleteJobButton jobId={jobData.id} locale={locale} />
        </div>
      )}
    </div>
  )
}
