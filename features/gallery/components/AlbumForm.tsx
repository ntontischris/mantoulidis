'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateAlbum } from '@/features/gallery/hooks/useGallery'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const albumSchema = z.object({
  title: z.string().min(2, 'Ο τίτλος πρέπει να έχει τουλάχιστον 2 χαρακτήρες'),
  title_en: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  is_published: z.boolean(),
})

type AlbumFormData = z.infer<typeof albumSchema>

interface AlbumFormProps {
  locale: string
  userId: string
}

export function AlbumForm({ locale, userId }: AlbumFormProps) {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateAlbum()

  const form = useForm<AlbumFormData>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: '',
      title_en: '',
      description: '',
      description_en: '',
      is_published: true,
    },
  })

  const handleSubmit = async (data: AlbumFormData) => {
    const album = await mutateAsync({
      title: data.title,
      title_en: data.title_en || null,
      description: data.description || null,
      description_en: data.description_en || null,
      is_published: data.is_published,
      cover_photo_url: null,
      event_id: null,
      created_by: userId,
    })
    router.push(`/${locale}/dashboard/gallery/${album.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title="Νέο Άλμπουμ" subtitle="Δημιουργήστε ένα νέο άλμπουμ φωτογραφιών" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Τίτλος (ΕΛ) *</FormLabel>
                  <FormControl>
                    <Input placeholder="π.χ. Αποφοίτηση 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (EN)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Graduation 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Περιγραφή (ΕΛ)</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Περιγραφή άλμπουμ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (EN)</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Album description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Δημιουργία...' : 'Δημιουργία Άλμπουμ'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
