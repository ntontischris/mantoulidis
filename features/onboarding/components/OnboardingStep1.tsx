'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step1Schema, type Step1Data } from '../schemas/onboarding.schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

interface OnboardingStep1Props {
  defaultValues?: Partial<Step1Data>
  onNext: (data: Step1Data) => void
}

export function OnboardingStep1({ defaultValues, onNext }: OnboardingStep1Props) {
  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      first_name_en: '',
      last_name_en: '',
      city: '',
      country: 'Ελλάδα',
      phone: '',
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Όνομα *</FormLabel>
                <FormControl>
                  <Input placeholder="Γιώργος" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Επώνυμο *</FormLabel>
                <FormControl>
                  <Input placeholder="Παπαδόπουλος" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name (EN)</FormLabel>
                <FormControl>
                  <Input placeholder="George" {...field} />
                </FormControl>
                <FormDescription>Προαιρετικό</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name (EN)</FormLabel>
                <FormControl>
                  <Input placeholder="Papadopoulos" {...field} />
                </FormControl>
                <FormDescription>Προαιρετικό</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Πόλη</FormLabel>
                <FormControl>
                  <Input placeholder="Αθήνα" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="Ελλάδα" {...field} />
                </FormControl>
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
              <FormControl>
                <Input type="tel" placeholder="+30 210 0000000" {...field} />
              </FormControl>
              <FormDescription>Προαιρετικό — μπορεί να παραμείνει ιδιωτικό</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Επόμενο →</Button>
        </div>
      </form>
    </Form>
  )
}
