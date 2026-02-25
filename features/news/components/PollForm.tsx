'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const pollSchema = z.object({
  question: z.string().min(5, 'Η ερώτηση είναι υποχρεωτική'),
  question_en: z.string().optional(),
  closes_at: z.string().optional(),
  is_active: z.boolean(),
})

export type PollFormValues = z.infer<typeof pollSchema>

export type PollOption = { text: string; text_en: string }

interface PollFormProps {
  defaultValues?: Partial<PollFormValues>
  defaultOptions?: PollOption[]
  onSubmit: (values: PollFormValues, options: PollOption[]) => Promise<void>
  isPending: boolean
  submitLabel?: string
}

export function PollForm({
  defaultValues,
  defaultOptions,
  onSubmit,
  isPending,
  submitLabel = 'Αποθήκευση',
}: PollFormProps) {
  const [options, setOptions] = useState<PollOption[]>(
    defaultOptions ?? [
      { text: '', text_en: '' },
      { text: '', text_en: '' },
    ]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PollFormValues>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      is_active: true,
      ...defaultValues,
    },
  })

  const addOption = () => setOptions((prev) => [...prev, { text: '', text_en: '' }])

  const removeOption = (idx: number) => {
    if (options.length <= 2) return
    setOptions((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateOption = (idx: number, field: keyof PollOption, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === idx ? { ...o, [field]: value } : o)))
  }

  const handleFormSubmit = async (values: PollFormValues) => {
    const filled = options.filter((o) => o.text.trim())
    if (filled.length < 2) {
      alert('Απαιτούνται τουλάχιστον 2 επιλογές')
      return
    }
    await onSubmit(values, filled)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Question (el) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Ερώτηση (Ελληνικά) <span className="text-destructive">*</span>
        </label>
        <Input {...register('question')} placeholder="π.χ. Ποιο event θέλετε να οργανώσουμε;" />
        {errors.question && <p className="text-xs text-destructive">{errors.question.message}</p>}
      </div>

      {/* Question (en) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Question (English)</label>
        <Input {...register('question_en')} placeholder="e.g. Which event should we organize?" />
      </div>

      {/* Closes at */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Λήξη Δημοψηφίσματος</label>
        <Input {...register('closes_at')} type="datetime-local" />
      </div>

      {/* Active */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          {...register('is_active')}
          className="rounded border-border"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-foreground">
          Ενεργό
        </label>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Επιλογές <span className="text-destructive">*</span>
          <span className="ml-1 text-xs font-normal text-muted-foreground">(min. 2)</span>
        </label>

        {options.map((opt, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <Input
                value={opt.text}
                onChange={(e) => updateOption(idx, 'text', e.target.value)}
                placeholder={`Επιλογή ${idx + 1} (ελληνικά)`}
              />
              <Input
                value={opt.text_en}
                onChange={(e) => updateOption(idx, 'text_en', e.target.value)}
                placeholder={`Option ${idx + 1} (English)`}
                className="text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => removeOption(idx)}
              disabled={options.length <= 2}
              className="mt-1 rounded p-1 text-muted-foreground hover:text-destructive disabled:opacity-30"
              title="Αφαίρεση επιλογής"
            >
              ✕
            </button>
          </div>
        ))}

        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          + Προσθήκη επιλογής
        </Button>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Αποθήκευση...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
