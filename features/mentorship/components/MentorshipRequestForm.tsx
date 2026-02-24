'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMentorshipRequest } from '../hooks/useMentorship'
import type { MentorProfile } from '../types'

const requestSchema = z.object({
  goals: z.string().min(10, 'Περιγράψτε τους στόχους σας (τουλάχιστον 10 χαρακτήρες)'),
  message: z.string().optional(),
})

type RequestFormValues = z.infer<typeof requestSchema>

interface MentorshipRequestFormProps {
  mentor: MentorProfile
  onSuccess: () => void
  onCancel: () => void
}

export function MentorshipRequestForm({ mentor, onSuccess, onCancel }: MentorshipRequestFormProps) {
  const { mutateAsync, isPending } = useMentorshipRequest()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormValues>({ resolver: zodResolver(requestSchema) })

  async function onSubmit(values: RequestFormValues) {
    await mutateAsync({
      mentorId: mentor.id,
      goals: values.goals,
      message: values.message,
    })
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">
          Αίτηση mentorship από{' '}
          <strong className="text-foreground">
            {mentor.first_name} {mentor.last_name}
          </strong>
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Στόχοι *
        </label>
        <textarea
          {...register('goals')}
          rows={3}
          placeholder="Τι θέλετε να επιτύχετε μέσα από αυτό το mentorship;"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {errors.goals && (
          <p className="mt-1 text-xs text-destructive">{errors.goals.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Μήνυμα (προαιρετικό)
        </label>
        <textarea
          {...register('message')}
          rows={2}
          placeholder="Ένα σύντομο μήνυμα για τον mentor..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
        >
          Ακύρωση
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? 'Αποστολή...' : 'Αποστολή αίτησης'}
        </button>
      </div>
    </form>
  )
}
