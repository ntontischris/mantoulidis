'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAdminJobs, useAdminUpdateJob, useAdminDeleteJob } from '@/features/admin/hooks/useAdmin'
import type { JobRow } from '@/lib/supabase/types'

const TYPE_LABELS: Record<string, string> = {
  full_time: 'Πλήρης',
  part_time: 'Μερική',
  contract: 'Σύμβαση',
  internship: 'Πρακτική',
  freelance: 'Freelance',
  volunteer: 'Εθελοντισμός',
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  closed: 'bg-muted text-muted-foreground',
  draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

const STATUS_LABELS: Record<string, string> = {
  open: 'Ανοιχτή',
  closed: 'Κλειστή',
  draft: 'Draft',
}

export default function AdminJobsPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const { data: jobs, isLoading } = useAdminJobs()
  const { mutate: deleteJob } = useAdminDeleteJob()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Διαχείριση Αγγελιών</h1>
          <p className="mt-1 text-sm text-muted-foreground">Όλες οι αγγελίες εργασίας</p>
        </div>
        <button
          onClick={() => router.push(`/${locale}/dashboard/jobs/new`)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Νέα Αγγελία
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Τίτλος</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Εταιρεία</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Τύπος</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Κατάσταση</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Ημερομηνία
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ενέργειες</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs && jobs.length > 0 ? (
                jobs.map((j) => (
                  <JobRow
                    key={j.id}
                    job={j}
                    locale={locale}
                    onEdit={() => router.push(`/${locale}/dashboard/jobs/${j.id}/edit`)}
                    onDelete={() => {
                      if (window.confirm('Να διαγραφεί αυτή η αγγελία;')) {
                        deleteJob(j.id)
                      }
                    }}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Δεν υπάρχουν αγγελίες
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function JobRow({
  job,
  onEdit,
  onDelete,
}: {
  job: JobRow
  locale?: string
  onEdit: () => void
  onDelete: () => void
}) {
  const { mutate: updateJob } = useAdminUpdateJob(job.id)

  const toggleStatus = () => {
    const next = job.status === 'open' ? 'closed' : 'open'
    updateJob({ status: next })
  }

  return (
    <tr className="hover:bg-muted/30">
      <td className="px-4 py-3">
        <p className="font-medium text-foreground">{job.title}</p>
        {job.is_remote && <span className="text-xs text-blue-500">Remote</span>}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{job.company}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {TYPE_LABELS[job.type] ?? job.type}
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[job.status] ?? ''}`}
        >
          {STATUS_LABELS[job.status] ?? job.status}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {new Date(job.created_at).toLocaleDateString('el-GR')}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button onClick={toggleStatus} className="text-xs text-blue-600 hover:underline">
            {job.status === 'open' ? 'Κλείσιμο' : 'Άνοιγμα'}
          </button>
          <button onClick={onEdit} className="text-xs text-foreground hover:underline">
            Επεξ.
          </button>
          <button onClick={onDelete} className="text-xs text-destructive hover:underline">
            Διαγ.
          </button>
        </div>
      </td>
    </tr>
  )
}
