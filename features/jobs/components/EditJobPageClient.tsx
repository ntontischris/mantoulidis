'use client'

import { useRouter } from 'next/navigation'
import { useUpdateJob } from '@/features/jobs/hooks/useJobs'
import { JobForm } from '@/features/jobs/components/JobForm'
import { PageHeader } from '@/components/shared/PageHeader'
import type { JobFormValues } from '@/features/jobs/components/JobForm'

interface JobData {
  id: string
  title: string
  title_en: string | null
  company: string
  description: string | null
  description_en: string | null
  type: string
  location: string | null
  is_remote: boolean
  salary_range: string | null
  apply_url: string | null
  apply_email: string | null
  industry: string | null
  expires_at: string | null
}

interface EditJobPageClientProps {
  locale: string
  id: string
  job: JobData
}

export function EditJobPageClient({ locale, id, job }: EditJobPageClientProps) {
  const router = useRouter()
  const { mutateAsync, isPending } = useUpdateJob(id)

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
            type: job.type as
              | 'full_time'
              | 'part_time'
              | 'contract'
              | 'internship'
              | 'freelance'
              | 'volunteer',
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
