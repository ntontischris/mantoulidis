'use client'

import { useRouter } from 'next/navigation'
import { useDeleteJob } from '../hooks/useJobs'

interface DeleteJobButtonProps {
  jobId: string
  locale: string
}

export function DeleteJobButton({ jobId, locale }: DeleteJobButtonProps) {
  const router = useRouter()
  const { mutate: deleteJob, isPending } = useDeleteJob()

  const handleDelete = () => {
    if (!confirm('Να διαγραφεί η αγγελία;')) return
    deleteJob(jobId, {
      onSuccess: () => router.push(`/${locale}/dashboard/jobs`),
    })
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
    >
      Διαγραφή
    </button>
  )
}
