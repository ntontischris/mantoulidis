'use client'

import { useSaveJob } from '../hooks/useJobs'

interface SavedJobButtonProps {
  jobId: string
  isSaved: boolean
}

export function SavedJobButton({ jobId, isSaved }: SavedJobButtonProps) {
  const { mutate, isPending } = useSaveJob(jobId)

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => mutate({ save: !isSaved })}
      className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted disabled:opacity-50"
      title={isSaved ? 'Αφαίρεση από αποθηκευμένα' : 'Αποθήκευση αγγελίας'}
    >
      {isSaved ? '★' : '☆'} {isSaved ? 'Αποθηκευμένο' : 'Αποθήκευση'}
    </button>
  )
}
