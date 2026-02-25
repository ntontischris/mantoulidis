'use client'

import { useParams, useRouter } from 'next/navigation'
import { useJob, useUpdateJob } from '@/features/jobs/hooks/useJobs'
import { JobForm } from '@/features/jobs/components/JobForm'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { JobFormValues } from '@/features/jobs/components/JobForm'

export default function EditJobPage() {
  const { id, locale } = useParams<{ id: string; locale: string }>()
  const router = useRouter()
  const { data: job, isLoading } = useJob(id)
  const { mutateAsync, isPending } = useUpdateJob(id)

  if (isLoading) return <LoadingSpinner />

  if (!job) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">Η αγγελία δεν βρέθηκε.</div>
    )
  }

  async function handleSubmit(values: JobFormValues) {
    await mutateAsync({
      title: values.title,
      title_en: values.title_en ?? null,
      company: values.company,
      description: values.description ?? null,
      description_en: values.description_en ?? null,
      type: values.type,
      location: values.location ?? null,
      is_remote: values.is_remote,
      salary_range: values.salary_range ?? null,
      apply_url: values.apply_url || null,
      apply_email: values.apply_email || null,
      industry: values.industry ?? null,
      expires_at: values.expires_at ? new Date(values.expires_at).toISOString() : null,
    })
    router.push(`/${locale}/dashboard/jobs/${id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title="Επεξεργασία Αγγελίας" subtitle={job.title} />
      <div className="rounded-2xl border border-border bg-card p-6">
        <JobForm
          defaultValues={{
            title: job.title,
            title_en: job.title_en ?? '',
            company: job.company,
            description: job.description ?? '',
            description_en: job.description_en ?? '',
            type: job.type,
            location: job.location ?? '',
            is_remote: job.is_remote,
            salary_range: job.salary_range ?? '',
            apply_url: job.apply_url ?? '',
            apply_email: job.apply_email ?? '',
            industry: job.industry ?? '',
            expires_at: job.expires_at ? job.expires_at.slice(0, 10) : '',
          }}
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitLabel="Αποθήκευση αλλαγών"
        />
      </div>
    </div>
  )
}
