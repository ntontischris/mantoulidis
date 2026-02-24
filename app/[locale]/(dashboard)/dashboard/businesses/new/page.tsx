'use client'

import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useCreateBusiness } from '@/features/businesses/hooks/useBusinesses'
import { BusinessForm } from '@/features/businesses/components/BusinessForm'
import { PageHeader } from '@/components/shared/PageHeader'

export default function NewBusinessPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const { user, profile } = useAuth()
  const { mutateAsync, isPending } = useCreateBusiness()

  const canCreate =
    profile?.role === 'verified_member' ||
    profile?.role === 'admin' ||
    profile?.role === 'super_admin'

  if (!user || !canCreate) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Μόνο επαληθευμένα μέλη μπορούν να καταχωρήσουν επιχείρηση.
      </div>
    )
  }

  type FormData = Parameters<Parameters<typeof BusinessForm>[0]['onSubmit']>[0]

  const handleSubmit = async (data: FormData) => {
    const biz = await mutateAsync({
      owner_id: user.id,
      name: data.name,
      name_en: data.name_en ?? null,
      description: data.description ?? null,
      description_en: data.description_en ?? null,
      category: data.category ?? null,
      industry: data.industry ?? null,
      website_url: data.website_url || null,
      email: data.email || null,
      phone: data.phone ?? null,
      address: data.address ?? null,
      city: data.city ?? null,
      country: data.country ?? 'Ελλάδα',
      linkedin_url: data.linkedin_url || null,
      instagram_url: null,
      logo_url: null,
      is_verified: false,
      is_active: true,
    })
    router.push(`/${locale}/dashboard/businesses/${biz.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Νέα Επιχείρηση"
        subtitle="Παρουσιάστε την επιχείρησή σας στην κοινότητα"
      />
      <BusinessForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Δημοσίευση"
      />
    </div>
  )
}
