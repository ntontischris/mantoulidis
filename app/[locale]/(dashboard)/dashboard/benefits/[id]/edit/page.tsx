'use client'

import { useParams, useRouter } from 'next/navigation'
import { useBenefit, useUpdateBenefit } from '@/features/benefits/hooks/useBenefits'
import { BenefitForm, benefitRowToFormValues } from '@/features/benefits/components/BenefitForm'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { BenefitFormValues } from '@/features/benefits/components/BenefitForm'

export default function EditBenefitPage() {
  const { id, locale } = useParams<{ id: string; locale: string }>()
  const router = useRouter()
  const { data: benefit, isLoading } = useBenefit(id)
  const { mutateAsync, isPending } = useUpdateBenefit(id)

  if (isLoading) return <LoadingSpinner />

  if (!benefit) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">Η παροχή δεν βρέθηκε.</div>
    )
  }

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
    })
    router.push(`/${locale}/dashboard/benefits/${id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title="Επεξεργασία Παροχής" subtitle={benefit.title} />
      <div className="rounded-2xl border border-border bg-card p-6">
        <BenefitForm
          defaultValues={benefitRowToFormValues(benefit)}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel="Αποθήκευση αλλαγών"
        />
      </div>
    </div>
  )
}
