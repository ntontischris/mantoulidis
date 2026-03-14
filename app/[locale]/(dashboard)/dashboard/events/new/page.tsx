import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewEventPageClient } from '@/features/events/components/NewEventPageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function NewEventPage({ params }: PageProps) {
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

  if (!canCreate) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Μόνο επαληθευμένα μέλη μπορούν να δημιουργήσουν εκδηλώσεις.
      </div>
    )
  }

  return <NewEventPageClient locale={locale} userId={user.id} />
}
