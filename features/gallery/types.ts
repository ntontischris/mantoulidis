import type { GalleryAlbumRow, GalleryPhotoRow } from '@/lib/supabase/types'

export type GalleryAlbum = GalleryAlbumRow
export type GalleryPhoto = GalleryPhotoRow

export interface UploadProgress {
  file: File
  progress: number
  // 0-100
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
  photoId?: string
}
