'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  useAdminAlbums,
  useAdminDeleteAlbum,
  useAdminPendingPhotos,
  useApprovePhoto,
  useRejectPhoto,
} from '@/features/admin/hooks/useAdmin'

export default function AdminGalleryPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()

  const { data: albums, isLoading: loadingAlbums } = useAdminAlbums()
  const { mutate: deleteAlbum } = useAdminDeleteAlbum()
  const { data: pendingPhotos, isLoading: loadingPending } = useAdminPendingPhotos()
  const { mutate: approvePhoto } = useApprovePhoto()
  const { mutate: rejectPhoto } = useRejectPhoto()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Διαχείριση Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">Albums και έγκριση φωτογραφιών</p>
        </div>
        <button
          onClick={() => router.push(`/${locale}/dashboard/gallery/new`)}
          className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Νέο Album
        </button>
      </div>

      {/* Pending photos */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Εκκρεμείς Φωτογραφίες
          {pendingPhotos && pendingPhotos.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              {pendingPhotos.length}
            </span>
          )}
        </h2>

        {loadingPending ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : pendingPhotos && pendingPhotos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {pendingPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption ?? 'Photo'}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-2">
                  <p className="truncate text-xs text-muted-foreground">
                    {photo.album_title ?? 'Άγνωστο album'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(photo.created_at).toLocaleDateString('el-GR')}
                  </p>
                </div>
                <div className="flex gap-2 border-t border-border p-2">
                  <button
                    onClick={() => approvePhoto(photo.id)}
                    className="flex-1 rounded-lg bg-green-600 py-1 text-xs font-medium text-white hover:opacity-90"
                  >
                    ✓ Έγκριση
                  </button>
                  <button
                    onClick={() => rejectPhoto(photo.id)}
                    className="flex-1 rounded-lg bg-destructive py-1 text-xs font-medium text-destructive-foreground hover:opacity-90"
                  >
                    ✗ Απόρριψη
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-border py-8 text-center text-sm text-muted-foreground">
            Δεν υπάρχουν εκκρεμείς φωτογραφίες
          </p>
        )}
      </div>

      {/* Albums */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Albums</h2>

        {loadingAlbums ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Τίτλος</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Φωτογραφίες
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Κατάσταση
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Ημερομηνία
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Ενέργειες
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {albums && albums.length > 0 ? (
                  albums.map((album) => (
                    <tr key={album.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{album.title}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {album.photo_count}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            album.is_published
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {album.is_published ? 'Δημοσιευμένο' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(album.created_at).toLocaleDateString('el-GR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/${locale}/dashboard/gallery/${album.id}`)}
                            className="text-xs text-foreground hover:underline"
                          >
                            Προβολή
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Να διαγραφεί αυτό το album;')) {
                                deleteAlbum(album.id)
                              }
                            }}
                            className="text-xs text-destructive hover:underline"
                          >
                            Διαγ.
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Δεν υπάρχουν albums
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
