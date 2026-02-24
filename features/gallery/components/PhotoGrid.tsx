'use client'

import Image from 'next/image'
import type { GalleryPhoto } from '../types'

interface PhotoGridProps {
  photos: GalleryPhoto[]
  onPhotoClick: (index: number) => void
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  if (photos.length === 0) return null

  return (
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          onClick={() => onPhotoClick(index)}
          className="relative mb-3 block w-full overflow-hidden rounded-xl bg-muted cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          style={{
            aspectRatio:
              photo.width && photo.height
                ? `${photo.width} / ${photo.height}`
                : '1 / 1',
          }}
        >
          <Image
            src={photo.url}
            alt={photo.caption ?? `Φωτογραφία ${index + 1}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  )
}
