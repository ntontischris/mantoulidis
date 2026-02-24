'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import type { GalleryPhoto } from '../types'

interface PhotoLightboxProps {
  photos: GalleryPhoto[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: PhotoLightboxProps) {
  const photo = photos[currentIndex]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
        onClick={onClose}
      >
        ✕
      </Button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-sm text-white/70 z-10">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Prev */}
      {currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10 h-12 w-12 text-2xl"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
        >
          ‹
        </Button>
      )}

      {/* Image */}
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.url}
          alt={photo.caption ?? `Φωτογραφία ${currentIndex + 1}`}
          width={photo.width ?? 1200}
          height={photo.height ?? 800}
          className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg"
          priority
        />
        {photo.caption && (
          <p className="mt-2 text-center text-sm text-white/80">{photo.caption}</p>
        )}
      </div>

      {/* Next */}
      {currentIndex < photos.length - 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10 h-12 w-12 text-2xl"
          onClick={(e) => { e.stopPropagation(); onNext() }}
        >
          ›
        </Button>
      )}
    </div>
  )
}
