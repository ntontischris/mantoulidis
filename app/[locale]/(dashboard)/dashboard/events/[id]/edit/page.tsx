import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditEventPageClient } from '@/features/events/components/EditEventPageClient'

interface PageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditEventPage({ params }: PageProps) {
  const { locale, id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: event } = await supabase
    .from('events')
    .select(
      'id, title, title_en, description, description_en, type, status, start_date, end_date, location, location_url, virtual_url, capacity, is_public, created_by'
    )
    .eq('id', id)
    .single()

  if (!event) notFound()

  if (event.created_by !== user.id) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Δεν έχετε πρόσβαση σε αυτή τη σελίδα.
      </div>
    )
  }

  return <EditEventPageClient locale={locale} id={id} event={event} />
}
