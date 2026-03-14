'use client'

import { useRouter } from 'next/navigation'
import { useCreateBenefit } from '@/features/benefits/hooks/useBenefits'
import { BenefitForm } from '@/features/benefits/components/BenefitForm'
import { PageHeader } from '@/components/shared/PageHeader'
import type { BenefitFormValues } from '@/features/benefits/components/BenefitForm'

interface NewBenefitPageClientProps {
  locale: string
}

export function NewBenefitPageClient({ locale }: NewBenefitPageClientProps) {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateBenefit()

  async function handleSubmit(values: BenefitFormValues) {
    await mutateAsync({
      title: values.title,
      title_en: values.title_en || null,
      description: values.description || null,
      description_en: values.description_en || null,
      category: values.category,
      partner_name: values.partner_name,
      partner_logo_url: values.partner_logo_url || null,
      discount_text: values.discount_text || null,
      terms: values.terms || null,
      terms_en: values.terms_en || null,
      redemption_code: values.redemption_code || null,
      redemption_url: values.redemption_url || null,
      valid_from: values.valid_from,
      valid_until: values.valid_until || null,
      max_redemptions: values.max_redemptions ? parseInt(values.max_redemptions) : null,
      is_active: values.is_active,
      requires_verified_member: values.requires_verified_member,
      created_by: null,
    })
    router.push(`/${locale}/dashboard/benefits`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title="Νέα Παροχή" subtitle="Δημιουργία νέας παροχής για τα μέλη" />
      <div className="rounded-2xl border border-border bg-card p-6">
        <BenefitForm
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel="Δημιουργία Παροχής"
        />
      </div>
    </div>
  )
}
