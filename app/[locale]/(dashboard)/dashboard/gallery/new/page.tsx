import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlbumForm } from '@/features/gallery/components/AlbumForm'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function NewAlbumPage({ params }: PageProps) {
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

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'

  if (!isAdmin) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Μόνο διαχειριστές μπορούν να δημιουργήσουν άλμπουμ.
      </div>
    )
  }

  return <AlbumForm locale={locale} userId={user.id} />
}
