'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useAlbum, useAlbumPhotos, usePhotoUpload } from '@/features/gallery/hooks/useGallery'
import { PhotoGrid } from '@/features/gallery/components/PhotoGrid'
import { PhotoUploadZone } from '@/features/gallery/components/PhotoUploadZone'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Separator } from '@/components/ui/separator'

// Heavy lightbox loaded only when needed
const PhotoLightbox = dynamic(
  () => import('@/features/gallery/components/PhotoLightbox').then((m) => m.PhotoLightbox),
  { ssr: false }
)

export default function AlbumDetailPage() {
  const { albumId } = useParams<{ locale: string; albumId: string }>()
  const { profile } = useAuth()
  const { data: album, isLoading: albumLoading } = useAlbum(albumId)
  const { data: photos, isLoading: photosLoading } = useAlbumPhotos(albumId)
  const { uploads, uploadFiles, clearUploads } = usePhotoUpload(albumId)

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
  const canUpload = isAdmin || profile?.role === 'verified_member'

  if (albumLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (!album) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Το άλμπουμ δεν βρέθηκε.
      </div>
    )
  }

  const approvedPhotos = photos ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title={album.title}
        subtitle={
          album.description ??
          `${album.photo_count} ${album.photo_count === 1 ? 'φωτογραφία' : 'φωτογραφίες'}`
        }
      />

      {/* Upload zone (admin / verified members) */}
      {canUpload && (
        <>
          <PhotoUploadZone
            uploads={uploads}
            onFilesSelected={uploadFiles}
            onClear={clearUploads}
          />
          <Separator />
        </>
      )}

      {/* Photo grid */}
      {photosLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : approvedPhotos.length === 0 ? (
        <EmptyState
          title="Δεν υπάρχουν φωτογραφίες ακόμα"
          description={canUpload ? 'Ανεβάστε φωτογραφίες παραπάνω' : 'Σύντομα!'}
        />
      ) : (
        <PhotoGrid
          photos={approvedPhotos}
          onPhotoClick={(index) => setLightboxIndex(index)}
        />
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && approvedPhotos.length > 0 && (
        <PhotoLightbox
          photos={approvedPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() =>
            setLightboxIndex((i) => Math.min(approvedPhotos.length - 1, (i ?? 0) + 1))
          }
        />
      )}
    </div>
  )
}
