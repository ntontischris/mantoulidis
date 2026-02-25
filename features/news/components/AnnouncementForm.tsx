'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const announcementSchema = z.object({
  title: z.string().min(3, 'Ο τίτλος είναι υποχρεωτικός'),
  title_en: z.string().optional(),
  body: z.string().min(10, 'Το κείμενο είναι υποχρεωτικό'),
  body_en: z.string().optional(),
  type: z.enum(['general', 'event', 'achievement', 'opportunity']),
  cover_url: z.string().url('Μη έγκυρο URL').optional().or(z.literal('')),
  is_published: z.boolean(),
})

export type AnnouncementFormValues = z.infer<typeof announcementSchema>

const TYPE_OPTIONS = [
  { value: 'general', label: 'Γενική Ανακοίνωση' },
  { value: 'event', label: 'Εκδήλωση' },
  { value: 'achievement', label: 'Επίτευγμα' },
  { value: 'opportunity', label: 'Ευκαιρία' },
]

interface AnnouncementFormProps {
  defaultValues?: Partial<AnnouncementFormValues>
  onSubmit: (values: AnnouncementFormValues) => Promise<void>
  isPending: boolean
  submitLabel?: string
}

export function AnnouncementForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Αποθήκευση',
}: AnnouncementFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      type: 'general',
      is_published: false,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title (el) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Τίτλος (Ελληνικά) <span className="text-destructive">*</span>
        </label>
        <Input {...register('title')} placeholder="π.χ. Νέες Παροχές για Μέλη" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      {/* Title (en) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Title (English)</label>
        <Input {...register('title_en')} placeholder="e.g. New Member Benefits" />
      </div>

      {/* Type */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Κατηγορία <span className="text-destructive">*</span>
        </label>
        <Select
          value={watch('type')}
          onValueChange={(v) => setValue('type', v as AnnouncementFormValues['type'])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Επιλέξτε κατηγορία" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Body (el) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Κείμενο (Ελληνικά) <span className="text-destructive">*</span>
        </label>
        <Textarea {...register('body')} rows={5} placeholder="Κείμενο ανακοίνωσης..." />
        {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
      </div>

      {/* Body (en) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Body (English)</label>
        <Textarea {...register('body_en')} rows={5} placeholder="Announcement body in English..." />
      </div>

      {/* Cover URL */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">URL Εικόνας Εξωφύλλου</label>
        <Input {...register('cover_url')} type="url" placeholder="https://..." />
        {errors.cover_url && <p className="text-xs text-destructive">{errors.cover_url.message}</p>}
      </div>

      {/* Published */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_published"
          {...register('is_published')}
          className="rounded border-border"
        />
        <label htmlFor="is_published" className="text-sm font-medium text-foreground">
          Δημοσίευση αμέσως
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Αποθήκευση...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
