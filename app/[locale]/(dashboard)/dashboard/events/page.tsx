import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EventsPageContent } from '@/features/events/components/EventsPageContent'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function EventsPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const canCreate =
    profile?.role === 'verified_member' ||
    profile?.role === 'admin' ||
    profile?.role === 'super_admin'

  return <EventsPageContent locale={locale} canCreate={canCreate} />
}
