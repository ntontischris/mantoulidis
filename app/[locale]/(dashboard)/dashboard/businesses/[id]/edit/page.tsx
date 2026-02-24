'use client'

import { useParams, useRouter } from 'next/navigation'
import { useBusiness, useUpdateBusiness } from '@/features/businesses/hooks/useBusinesses'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { BusinessForm } from '@/features/businesses/components/BusinessForm'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function EditBusinessPage() {
  const { locale, id } = useParams<{ locale: string; id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const { data: business, isLoading } = useBusiness(id)
  const { mutateAsync, isPending } = useUpdateBusiness(id)

  if (isLoading) return <LoadingSpinner />

  if (!business || business.owner_id !== user?.id) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Δεν έχετε πρόσβαση σε αυτή τη σελίδα.
      </div>
    )
  }

  const handleSubmit = async (data: Parameters<typeof mutateAsync>[0]) => {
    await mutateAsync(data)
    router.push(`/${locale}/dashboard/businesses/${id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Επεξεργασία Επιχείρησης"
        subtitle={business.name}
      />
      <BusinessForm
        defaultValues={{
          name: business.name,
          name_en: business.name_en ?? '',
          description: business.description ?? '',
          description_en: business.description_en ?? '',
          category: business.category ?? '',
          industry: business.industry ?? '',
          website_url: business.website_url ?? '',
          email: business.email ?? '',
          phone: business.phone ?? '',
          address: business.address ?? '',
          city: business.city ?? '',
          country: business.country ?? 'Ελλάδα',
          linkedin_url: business.linkedin_url ?? '',
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Αποθήκευση αλλαγών"
      />
    </div>
  )
}
