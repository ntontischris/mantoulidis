'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEvent, useUpdateEvent } from '@/features/events/hooks/useEvents'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { EventForm } from '@/features/events/components/EventForm'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { EventFormData } from '@/features/events/components/EventForm'

function toLocalDatetimeValue(iso: string): string {
  // Convert UTC ISO to local datetime-local input value
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EditEventPage() {
  const { locale, id } = useParams<{ locale: string; id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const { data: event, isLoading } = useEvent(id)
  const { mutateAsync, isPending } = useUpdateEvent(id)

  if (isLoading) return <LoadingSpinner />

  if (!event || (event.created_by !== user?.id)) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Δεν έχετε πρόσβαση σε αυτή τη σελίδα.
      </div>
    )
  }

  const handleSubmit = async (data: EventFormData) => {
    await mutateAsync({
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
      capacity: data.capacity && data.capacity !== '' ? parseInt(data.capacity) : null,
      is_public: data.is_public,
    })
    router.push(`/${locale}/dashboard/events/${id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Επεξεργασία Εκδήλωσης"
        subtitle={event.title}
      />
      <EventForm
        defaultValues={{
          title: event.title,
          title_en: event.title_en ?? '',
          description: event.description ?? '',
          description_en: event.description_en ?? '',
          type: event.type,
          status: event.status === 'published' || event.status === 'draft' ? event.status : 'draft',
          start_date: toLocalDatetimeValue(event.start_date),
          end_date: toLocalDatetimeValue(event.end_date),
          location: event.location ?? '',
          location_url: event.location_url ?? '',
          virtual_url: event.virtual_url ?? '',
          capacity: event.capacity != null ? String(event.capacity) : '',
          is_public: event.is_public,
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Αποθήκευση αλλαγών"
      />
    </div>
  )
}
