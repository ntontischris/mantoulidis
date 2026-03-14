import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlbumDetailContent } from '@/features/gallery/components/AlbumDetailContent'
import { PageHeader } from '@/components/shared/PageHeader'

interface AlbumDetailPageProps {
  params: Promise<{ locale: string; albumId: string }>
}

export default async function AlbumDetailPage({ params }: AlbumDetailPageProps) {
  const { locale, albumId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const [{ data: album }, { data: profile }] = await Promise.all([
    supabase.from('gallery_albums').select('*').eq('id', albumId).single(),
    supabase.from('profiles').select('role').eq('id', user.id).single(),
  ])

  if (!album) notFound()

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
  const canUpload = isAdmin || profile?.role === 'verified_member'

  return (
    <div className="space-y-6">
      <PageHeader
        title={album.title}
        subtitle={
          album.description ??
          `${album.photo_count} ${album.photo_count === 1 ? 'φωτογραφία' : 'φωτογραφίες'}`
        }
      />

      <AlbumDetailContent albumId={albumId} canUpload={canUpload} />
    </div>
  )
}
