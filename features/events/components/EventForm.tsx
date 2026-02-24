'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const eventSchema = z.object({
  title: z.string().min(3, 'Ο τίτλος πρέπει να έχει τουλάχιστον 3 χαρακτήρες'),
  title_en: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  type: z.enum(['in_person', 'virtual', 'hybrid']),
  status: z.enum(['draft', 'published']),
  start_date: z.string().min(1, 'Η ημερομηνία έναρξης είναι υποχρεωτική'),
  end_date: z.string().min(1, 'Η ημερομηνία λήξης είναι υποχρεωτική'),
  location: z.string().optional(),
  location_url: z.string().url('Μη έγκυρο URL').optional().or(z.literal('')),
  virtual_url: z.string().url('Μη έγκυρο URL').optional().or(z.literal('')),
  // String in the form, converted to number in submit handler
  capacity: z.string().optional(),
  is_public: z.boolean(),
})

export type EventFormData = z.infer<typeof eventSchema>

interface EventFormProps {
  defaultValues?: Partial<EventFormData>
  onSubmit: (data: EventFormData) => Promise<void>
  isPending: boolean
  submitLabel?: string
}

export function EventForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Αποθήκευση',
}: EventFormProps) {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      title_en: '',
      description: '',
      description_en: '',
      type: 'in_person',
      status: 'published',
      start_date: '',
      end_date: '',
      location: '',
      location_url: '',
      virtual_url: '',
      is_public: true,
      ...defaultValues,
    },
  })

  const eventType = form.watch('type')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τίτλος (ΕΛ) *</FormLabel>
                <FormControl>
                  <Input placeholder="π.χ. Ετήσια Συνάντηση Αποφοίτων" {...field} />
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
                  <Input placeholder="e.g. Annual Alumni Reunion" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Περιγραφή (ΕΛ)</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Περιγραφή εκδήλωσης..." {...field} />
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
                <Textarea rows={4} placeholder="Event description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type + Status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τύπος *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Επιλέξτε τύπο" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="in_person">Δια ζώσης</SelectItem>
                    <SelectItem value="virtual">Διαδικτυακή</SelectItem>
                    <SelectItem value="hybrid">Υβριδική</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Κατάσταση *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Επιλέξτε κατάσταση" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Πρόχειρο</SelectItem>
                    <SelectItem value="published">Δημοσιευμένο</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Έναρξη *</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Λήξη *</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location */}
        {(eventType === 'in_person' || eventType === 'hybrid') && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Τοποθεσία</FormLabel>
                  <FormControl>
                    <Input placeholder="π.χ. Αμφιθέατρο Α, Κτίριο Β" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Σύνδεσμος χάρτη</FormLabel>
                  <FormControl>
                    <Input placeholder="https://maps.google.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Virtual URL */}
        {(eventType === 'virtual' || eventType === 'hybrid') && (
          <FormField
            control={form.control}
            name="virtual_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Σύνδεσμος διαδικτυακής εκδήλωσης</FormLabel>
                <FormControl>
                  <Input placeholder="https://zoom.us/j/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Capacity */}
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Χωρητικότητα (άδειο = απεριόριστο)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="π.χ. 100"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* is_public — hidden, always true for now */}

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? 'Αποθήκευση...' : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
