'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { GalleryAlbumInsert, GalleryAlbumUpdate } from '@/lib/supabase/types'
import type { UploadProgress } from '../types'

// ── Albums ────────────────────────────────────────────────────────────────────

export function useAlbums() {
  return useQuery({
    queryKey: ['gallery_albums'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useAlbum(id: string) {
  return useQuery({
    queryKey: ['gallery_albums', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateAlbum() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: GalleryAlbumInsert) => {
      const supabase = createClient()
      const { data: created, error } = await supabase
        .from('gallery_albums')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return created
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery_albums'] })
    },
  })
}

export function useUpdateAlbum(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: GalleryAlbumUpdate) => {
      const supabase = createClient()
      const { data: updated, error } = await supabase
        .from('gallery_albums')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery_albums'] })
      queryClient.invalidateQueries({ queryKey: ['gallery_albums', id] })
    },
  })
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('gallery_albums').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery_albums'] })
    },
  })
}

// ── Photos ────────────────────────────────────────────────────────────────────

export function useAlbumPhotos(albumId: string) {
  return useQuery({
    queryKey: ['gallery_photos', albumId],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('album_id', albumId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data ?? []
    },
    enabled: !!albumId,
  })
}

export function useDeletePhoto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, albumId, storagePath }: { id: string; albumId: string; storagePath: string }) => {
      const supabase = createClient()
      // Delete from storage first
      await supabase.storage.from('gallery').remove([storagePath])
      // Then delete the DB record
      const { error } = await supabase.from('gallery_photos').delete().eq('id', id)
      if (error) throw error
      return albumId
    },
    onSuccess: (albumId) => {
      queryClient.invalidateQueries({ queryKey: ['gallery_photos', albumId] })
      queryClient.invalidateQueries({ queryKey: ['gallery_albums'] })
    },
  })
}

// ── Photo Upload ──────────────────────────────────────────────────────────────

export function usePhotoUpload(albumId: string) {
  const queryClient = useQueryClient()
  const [uploads, setUploads] = useState<UploadProgress[]>([])

  const updateUpload = (index: number, patch: Partial<UploadProgress>) => {
    setUploads((prev) =>
      prev.map((u, i) => (i === index ? { ...u, ...patch } : u))
    )
  }

  const uploadFiles = async (files: File[]) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const initial: UploadProgress[] = files.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }))
    setUploads(initial)

    await Promise.all(
      files.map(async (file, index) => {
        try {
          updateUpload(index, { status: 'uploading', progress: 10 })

          // Unique storage path
          const ext = file.name.split('.').pop() ?? 'jpg'
          const storagePath = `${albumId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

          const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(storagePath, file, { cacheControl: '3600', upsert: false })

          if (uploadError) throw uploadError
          updateUpload(index, { progress: 70 })

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(storagePath)

          // Insert DB record
          const { data: photo, error: dbError } = await supabase
            .from('gallery_photos')
            .insert({
              album_id: albumId,
              storage_path: storagePath,
              url: publicUrl,
              file_size: file.size,
              uploaded_by: user.id,
              is_approved: true,
            })
            .select()
            .single()

          if (dbError) throw dbError
          updateUpload(index, { progress: 100, status: 'done', photoId: photo.id })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Upload failed'
          updateUpload(index, { status: 'error', error: message })
        }
      })
    )

    queryClient.invalidateQueries({ queryKey: ['gallery_photos', albumId] })
    queryClient.invalidateQueries({ queryKey: ['gallery_albums'] })
  }

  const clearUploads = () => setUploads([])

  return { uploads, uploadFiles, clearUploads }
}
