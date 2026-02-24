'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Job } from '../types'

export const jobSchema = z.object({
  title: z.string().min(3, 'Ο τίτλος είναι υποχρεωτικός'),
  title_en: z.string().optional(),
  company: z.string().min(2, 'Η εταιρεία είναι υποχρεωτική'),
  description: z.string().optional(),
  description_en: z.string().optional(),
  type: z.enum(['full_time', 'part_time', 'contract', 'internship', 'freelance', 'volunteer']),
  location: z.string().optional(),
  is_remote: z.boolean(),
  salary_range: z.string().optional(),
  apply_url: z.string().url('Μη έγκυρο URL').optional().or(z.literal('')),
  apply_email: z.string().email('Μη έγκυρο email').optional().or(z.literal('')),
  industry: z.string().optional(),
  expires_at: z.string().optional(),
})

export type JobFormValues = z.infer<typeof jobSchema>

interface JobFormProps {
  defaultValues?: Partial<JobFormValues>
  onSubmit: (values: JobFormValues) => Promise<void>
  isLoading?: boolean
  submitLabel?: string
}

const TYPE_OPTIONS = [
  { value: 'full_time', label: 'Πλήρης Απασχόληση' },
  { value: 'part_time', label: 'Μερική Απασχόληση' },
  { value: 'contract', label: 'Σύμβαση' },
  { value: 'internship', label: 'Πρακτική' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'volunteer', label: 'Εθελοντισμός' },
]

export function JobForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Δημοσίευση' }: JobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      type: 'full_time',
      is_remote: false,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Title */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium">Τίτλος θέσης *</label>
          <input
            {...register('title')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium">Τίτλος (Αγγλικά)</label>
          <input
            {...register('title_en')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Company */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Εταιρεία *</label>
          <input
            {...register('company')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.company && <p className="mt-1 text-xs text-destructive">{errors.company.message}</p>}
        </div>

        {/* Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Τύπος *</label>
          <select
            {...register('type')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Τοποθεσία</label>
          <input
            {...register('location')}
            placeholder="π.χ. Αθήνα, Ελλάδα"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Salary */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Εύρος μισθού</label>
          <input
            {...register('salary_range')}
            placeholder="π.χ. €1.500–2.000/μήνα"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Remote */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_remote"
            {...register('is_remote')}
            className="rounded border-border"
          />
          <label htmlFor="is_remote" className="text-sm font-medium cursor-pointer">
            Εξ αποστάσεως (Remote)
          </label>
        </div>

        {/* Industry */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Κλάδος</label>
          <input
            {...register('industry')}
            placeholder="π.χ. Τεχνολογία, Χρηματοοικονομικά"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Apply URL */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">URL αίτησης</label>
          <input
            {...register('apply_url')}
            type="url"
            placeholder="https://..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.apply_url && <p className="mt-1 text-xs text-destructive">{errors.apply_url.message}</p>}
        </div>

        {/* Apply Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email αίτησης</label>
          <input
            {...register('apply_email')}
            type="email"
            placeholder="hr@company.com"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.apply_email && <p className="mt-1 text-xs text-destructive">{errors.apply_email.message}</p>}
        </div>

        {/* Expires at */}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Λήξη αγγελίας</label>
          <input
            {...register('expires_at')}
            type="date"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium">Περιγραφή (Ελληνικά)</label>
          <textarea
            {...register('description')}
            rows={5}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium">Περιγραφή (Αγγλικά)</label>
          <textarea
            {...register('description_en')}
            rows={5}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? 'Αποθήκευση...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
