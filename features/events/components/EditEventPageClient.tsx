'use client'

import { useRouter } from 'next/navigation'
import { useUpdateEvent } from '@/features/events/hooks/useEvents'
import { EventForm } from '@/features/events/components/EventForm'
import { PageHeader } from '@/components/shared/PageHeader'
import type { EventFormData } from '@/features/events/components/EventForm'

function toLocalDatetimeValue(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

interface EventData {
  id: string
  title: string
  title_en: string | null
  description: string | null
  description_en: string | null
  type: string
  status: string
  start_date: string
  end_date: string
  location: string | null
  location_url: string | null
  virtual_url: string | null
  capacity: number | null
  is_public: boolean
}

interface EditEventPageClientProps {
  locale: string
  id: string
  event: EventData
}

export function EditEventPageClient({ locale, id, event }: EditEventPageClientProps) {
  const router = useRouter()
  const { mutateAsync, isPending } = useUpdateEvent(id)

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
      <PageHeader title="Επεξεργασία Εκδήλωσης" subtitle={event.title} />
      <EventForm
        defaultValues={{
          title: event.title,
          title_en: event.title_en ?? '',
          description: event.description ?? '',
          description_en: event.description_en ?? '',
          type: event.type as 'in_person' | 'virtual' | 'hybrid',
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
