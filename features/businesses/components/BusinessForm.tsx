'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  FormDescription,
} from '@/components/ui/form'
import type { Tables, BusinessInsert, BusinessUpdate } from '@/lib/supabase/types'

const businessSchema = z.object({
  name: z.string().min(2, 'Τουλάχιστον 2 χαρακτήρες').max(200),
  name_en: z.string().max(200).optional(),
  description: z.string().max(3000).optional(),
  description_en: z.string().max(3000).optional(),
  category: z.string().max(100).optional(),
  industry: z.string().max(100).optional(),
  website_url: z.string().url('Μη έγκυρο URL').optional().or(z.literal('')),
  email: z.string().email('Μη έγκυρο email').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  linkedin_url: z.string().url('Μη έγκυρο URL').optional().or(z.literal('')),
})

type BusinessFormData = z.infer<typeof businessSchema>

interface BusinessFormProps {
  defaultValues?: Partial<BusinessFormData>
  onSubmit: (data: BusinessFormData) => void
  isPending: boolean
  submitLabel?: string
}

export function BusinessForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Αποθήκευση',
}: BusinessFormProps) {
  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      name_en: '',
      description: '',
      description_en: '',
      category: '',
      industry: '',
      website_url: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'Ελλάδα',
      linkedin_url: '',
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Επωνυμία *</FormLabel>
                <FormControl><Input placeholder="π.χ. Tech Solutions ΑΕ" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (EN)</FormLabel>
                <FormControl><Input placeholder="English name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Κατηγορία</FormLabel>
                <FormControl><Input placeholder="π.χ. Λογισμικό, Εισαγωγές" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Κλάδος</FormLabel>
                <FormControl><Input placeholder="π.χ. Τεχνολογία" {...field} /></FormControl>
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
              <FormLabel>Περιγραφή (GR)</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Περιγράψτε την επιχείρησή σας..." {...field} />
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
                <Textarea rows={3} placeholder="Describe your business..." {...field} />
              </FormControl>
              <FormDescription>Προαιρετικό</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Πόλη</FormLabel>
                <FormControl><Input placeholder="Αθήνα" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Χώρα</FormLabel>
                <FormControl><Input placeholder="Ελλάδα" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl><Input type="url" placeholder="https://..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email επικοινωνίας</FormLabel>
                <FormControl><Input type="email" placeholder="info@..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Τηλέφωνο</FormLabel>
              <FormControl><Input type="tel" placeholder="+30 210 0000000" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Αποθήκευση...' : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
