'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useCreateGroup } from '@/features/groups/hooks/useGroups'

const groupSchema = z.object({
  name: z.string().min(3, 'Το όνομα είναι υποχρεωτικό'),
  name_en: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  is_private: z.boolean(),
})

type GroupFormValues = z.infer<typeof groupSchema>

interface GroupFormProps {
  locale: string
}

export function GroupForm({ locale }: GroupFormProps) {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateGroup()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: { is_private: false },
  })

  async function onSubmit(values: GroupFormValues) {
    const group = await mutateAsync({
      name: values.name,
      name_en: values.name_en ?? null,
      description: values.description ?? null,
      description_en: values.description_en ?? null,
      is_private: values.is_private,
      cover_url: null,
    })
    router.push(`/${locale}/dashboard/groups/${group.id}`)
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Νέα Ομάδα</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Δημιουργήστε μια κοινότητα για αποφοίτους
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-2xl border border-border bg-card p-6"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium">Όνομα *</label>
          <input
            {...register('name')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Όνομα (Αγγλικά)</label>
          <input
            {...register('name_en')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Περιγραφή</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Περιγραφή (Αγγλικά)</label>
          <textarea
            {...register('description_en')}
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_private"
            {...register('is_private')}
            className="rounded border-border"
          />
          <label htmlFor="is_private" className="cursor-pointer text-sm font-medium">
            Ιδιωτική ομάδα (μόνο με πρόσκληση)
          </label>
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? 'Δημιουργία...' : 'Δημιουργία Ομάδας'}
          </button>
        </div>
      </form>
    </div>
  )
}
