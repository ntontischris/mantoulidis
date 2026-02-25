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
import { BENEFIT_CATEGORIES } from '../types'
import type { BenefitRow } from '@/lib/supabase/types'

const benefitSchema = z.object({
  title: z.string().min(2, 'Ο τίτλος είναι υποχρεωτικός'),
  title_en: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  category: z.string().min(1, 'Η κατηγορία είναι υποχρεωτική'),
  partner_name: z.string().min(2, 'Το όνομα συνεργάτη είναι υποχρεωτικό'),
  partner_logo_url: z.string().url('Μη έγκυρο URL').optional().or(z.literal('')),
  discount_text: z.string().optional(),
  terms: z.string().optional(),
  terms_en: z.string().optional(),
  redemption_code: z.string().optional(),
  redemption_url: z.string().url('Μη έγκυρο URL').optional().or(z.literal('')),
  valid_from: z.string().min(1, 'Η ημερομηνία έναρξης είναι υποχρεωτική'),
  valid_until: z.string().optional(),
  max_redemptions: z.string().optional(),
  is_active: z.boolean(),
  requires_verified_member: z.boolean(),
})

export type BenefitFormValues = z.infer<typeof benefitSchema>

interface BenefitFormProps {
  defaultValues?: Partial<BenefitFormValues>
  onSubmit: (values: BenefitFormValues) => Promise<void>
  isPending: boolean
  submitLabel?: string
}

function toDateInputValue(isoOrNull: string | null | undefined): string {
  if (!isoOrNull) return ''
  return isoOrNull.slice(0, 10)
}

export function benefitRowToFormValues(b: BenefitRow): BenefitFormValues {
  return {
    title: b.title,
    title_en: b.title_en ?? '',
    description: b.description ?? '',
    description_en: b.description_en ?? '',
    category: b.category,
    partner_name: b.partner_name,
    partner_logo_url: b.partner_logo_url ?? '',
    discount_text: b.discount_text ?? '',
    terms: b.terms ?? '',
    terms_en: b.terms_en ?? '',
    redemption_code: b.redemption_code ?? '',
    redemption_url: b.redemption_url ?? '',
    valid_from: toDateInputValue(b.valid_from),
    valid_until: toDateInputValue(b.valid_until),
    max_redemptions: b.max_redemptions != null ? String(b.max_redemptions) : '',
    is_active: b.is_active,
    requires_verified_member: b.requires_verified_member,
  }
}

export function BenefitForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Αποθήκευση',
}: BenefitFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BenefitFormValues>({
    resolver: zodResolver(benefitSchema),
    defaultValues: {
      category: 'discount',
      is_active: true,
      requires_verified_member: true,
      valid_from: new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Title (el) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Τίτλος (Ελληνικά) <span className="text-destructive">*</span>
          </label>
          <Input {...register('title')} placeholder="π.χ. 20% Έκπτωση στα βιβλία" />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        {/* Title (en) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title (English)</label>
          <Input {...register('title_en')} placeholder="e.g. 20% Book Discount" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Partner name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Όνομα Συνεργάτη <span className="text-destructive">*</span>
          </label>
          <Input {...register('partner_name')} placeholder="π.χ. Βιβλιοπωλείο XYZ" />
          {errors.partner_name && (
            <p className="text-xs text-destructive">{errors.partner_name.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Κατηγορία <span className="text-destructive">*</span>
          </label>
          <Select value={watch('category')} onValueChange={(v) => setValue('category', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Επιλέξτε κατηγορία" />
            </SelectTrigger>
            <SelectContent>
              {BENEFIT_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>
      </div>

      {/* Partner logo URL */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">URL Logo Συνεργάτη</label>
        <Input {...register('partner_logo_url')} type="url" placeholder="https://..." />
        {errors.partner_logo_url && (
          <p className="text-xs text-destructive">{errors.partner_logo_url.message}</p>
        )}
      </div>

      {/* Description (el) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Περιγραφή (Ελληνικά)</label>
        <Textarea {...register('description')} rows={3} placeholder="Σύντομη περιγραφή..." />
      </div>

      {/* Description (en) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Description (English)</label>
        <Textarea {...register('description_en')} rows={3} placeholder="Short description..." />
      </div>

      {/* Discount text */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Κείμενο Έκπτωσης</label>
        <Input {...register('discount_text')} placeholder="π.χ. 20% off, Δωρεάν αποστολή" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Redemption code */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Κωδικός Εξαργύρωσης</label>
          <Input {...register('redemption_code')} placeholder="π.χ. ALUMNI20" />
        </div>

        {/* Redemption URL */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">URL Εξαργύρωσης</label>
          <Input {...register('redemption_url')} type="url" placeholder="https://..." />
          {errors.redemption_url && (
            <p className="text-xs text-destructive">{errors.redemption_url.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Valid from */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Έναρξη Ισχύος <span className="text-destructive">*</span>
          </label>
          <Input {...register('valid_from')} type="date" />
          {errors.valid_from && (
            <p className="text-xs text-destructive">{errors.valid_from.message}</p>
          )}
        </div>

        {/* Valid until */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Λήξη Ισχύος</label>
          <Input {...register('valid_until')} type="date" />
        </div>

        {/* Max redemptions */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Μέγιστες Εξαργυρώσεις</label>
          <Input {...register('max_redemptions')} type="number" min={1} placeholder="∞" />
        </div>
      </div>

      {/* Terms (el) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Όροι Χρήσης (Ελληνικά)</label>
        <Textarea {...register('terms')} rows={3} placeholder="Όροι και προϋποθέσεις..." />
      </div>

      {/* Terms (en) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Terms (English)</label>
        <Textarea {...register('terms_en')} rows={3} placeholder="Terms and conditions..." />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            {...register('is_active')}
            className="rounded border-border"
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Ενεργό
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="requires_verified_member"
            {...register('requires_verified_member')}
            className="rounded border-border"
          />
          <label htmlFor="requires_verified_member" className="text-sm font-medium">
            Απαιτεί Verified Μέλος
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Αποθήκευση...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
