'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useAlbumPhotos, usePhotoUpload } from '@/features/gallery/hooks/useGallery'
import { PhotoGrid } from '@/features/gallery/components/PhotoGrid'
import { PhotoUploadZone } from '@/features/gallery/components/PhotoUploadZone'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Separator } from '@/components/ui/separator'

const PhotoLightbox = dynamic(
  () => import('@/features/gallery/components/PhotoLightbox').then((m) => m.PhotoLightbox),
  { ssr: false }
)

interface AlbumDetailContentProps {
  albumId: string
  canUpload: boolean
}

export function AlbumDetailContent({ albumId, canUpload }: AlbumDetailContentProps) {
  const { data: photos, isLoading: photosLoading } = useAlbumPhotos(albumId)
  const { uploads, uploadFiles, clearUploads } = usePhotoUpload(albumId)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const approvedPhotos = photos ?? []

  return (
    <>
      {canUpload && (
        <>
          <PhotoUploadZone uploads={uploads} onFilesSelected={uploadFiles} onClear={clearUploads} />
          <Separator />
        </>
      )}

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
        <PhotoGrid photos={approvedPhotos} onPhotoClick={(index) => setLightboxIndex(index)} />
      )}

      {lightboxIndex !== null && approvedPhotos.length > 0 && (
        <PhotoLightbox
          photos={approvedPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setLightboxIndex((i) => Math.min(approvedPhotos.length - 1, (i ?? 0) + 1))}
        />
      )}
    </>
  )
}
