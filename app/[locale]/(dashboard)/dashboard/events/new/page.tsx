'use client'

import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useCreateEvent } from '@/features/events/hooks/useEvents'
import { EventForm } from '@/features/events/components/EventForm'
import { PageHeader } from '@/components/shared/PageHeader'
import type { EventFormData } from '@/features/events/components/EventForm'

export default function NewEventPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const { user, profile } = useAuth()
  const { mutateAsync, isPending } = useCreateEvent()

  const canCreate =
    profile?.role === 'verified_member' ||
    profile?.role === 'admin' ||
    profile?.role === 'super_admin'

  if (!user || !canCreate) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Μόνο επαληθευμένα μέλη μπορούν να δημιουργήσουν εκδηλώσεις.
      </div>
    )
  }

  const handleSubmit = async (data: EventFormData) => {
    const event = await mutateAsync({
      title: data.title,
      title_en: data.title_en || null,
      description: data.description || null,
      description_en: data.description_en || null,
      type: data.type,
      status: data.status,
      start_date: new Date(data.start_date).toISOString(),
      end_date: new Date(data.end_date).toISOString(),
      location: data.location || null,
      location_url: data.location_url || null,
      virtual_url: data.virtual_url || null,
      cover_url: null,
      capacity: data.capacity && data.capacity !== '' ? parseInt(data.capacity) : null,
      is_public: data.is_public,
      created_by: user.id,
    })
    router.push(`/${locale}/dashboard/events/${event.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Νέα Εκδήλωση"
        subtitle="Δημιουργήστε μια νέα εκδήλωση για την κοινότητα"
      />
      <EventForm onSubmit={handleSubmit} isPending={isPending} submitLabel="Δημοσίευση" />
    </div>
  )
}
