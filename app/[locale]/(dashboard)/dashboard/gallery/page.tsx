import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlbumCard } from '@/features/gallery/components/AlbumCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'

interface GalleryPageProps {
  params: Promise<{ locale: string }>
}

export default async function GalleryPage({ params }: GalleryPageProps) {
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

  const { data: albums } = await supabase
    .from('gallery_albums')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Φωτογραφικό Αρχείο"
        subtitle="Αναμνήσεις και στιγμές της κοινότητας"
        action={
          isAdmin ? (
            <Button asChild size="sm">
              <Link href={`/${locale}/dashboard/gallery/new`}>+ Νέο Άλμπουμ</Link>
            </Button>
          ) : undefined
        }
      />

      {!albums || albums.length === 0 ? (
        <EmptyState
          title="Δεν υπάρχουν άλμπουμ ακόμα"
          description={isAdmin ? 'Δημιουργήστε το πρώτο άλμπουμ' : 'Σύντομα!'}
          action={
            isAdmin ? (
              <Button asChild size="sm">
                <Link href={`/${locale}/dashboard/gallery/new`}>+ Νέο Άλμπουμ</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
