import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import type { GalleryAlbum } from '../types'

interface AlbumCardProps {
  album: GalleryAlbum
  locale: string
}

export function AlbumCard({ album, locale }: AlbumCardProps) {
  return (
    <Link
      href={`/${locale}/dashboard/gallery/${album.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Cover */}
      <div className="relative flex h-48 items-center justify-center bg-muted overflow-hidden">
        {album.cover_photo_url ? (
          <Image
            src={album.cover_photo_url}
            alt={album.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl select-none">🖼️</span>
        )}
        {!album.is_published && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary">Πρόχειρο</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {album.title}
          </p>
          {album.description && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{album.description}</p>
          )}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {album.photo_count} {album.photo_count === 1 ? 'φωτογραφία' : 'φωτογραφίες'}
        </span>
      </div>
    </Link>
  )
}
