'use client'

import { useParams, useRouter } from 'next/navigation'
import { JobForm } from '@/features/jobs/components/JobForm'
import { useCreateJob } from '@/features/jobs/hooks/useJobs'
import type { JobFormValues } from '@/features/jobs/components/JobForm'

export default function NewJobPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateJob()

  async function handleSubmit(values: JobFormValues) {
    const job = await mutateAsync({
      title: values.title,
      title_en: values.title_en ?? null,
      company: values.company,
      description: values.description ?? null,
      description_en: values.description_en ?? null,
      type: values.type,
      status: 'open',
      location: values.location ?? null,
      is_remote: values.is_remote,
      salary_range: values.salary_range ?? null,
      apply_url: values.apply_url || null,
      apply_email: values.apply_email || null,
      industry: values.industry ?? null,
      expires_at: values.expires_at
        ? new Date(values.expires_at).toISOString()
        : null,
    })
    router.push(`/${locale}/dashboard/jobs/${job.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Νέα Αγγελία</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Δημοσιεύστε μια ευκαιρία εργασίας για την κοινότητα
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <JobForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  )
}
