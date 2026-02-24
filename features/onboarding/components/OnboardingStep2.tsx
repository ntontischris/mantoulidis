'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step2Schema, type Step2Data } from '../schemas/onboarding.schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from(
  { length: CURRENT_YEAR - 1990 + 1 },
  (_, i) => CURRENT_YEAR - i,
)

interface OnboardingStep2Props {
  defaultValues?: Partial<Step2Data>
  onNext: (data: Step2Data) => void
  onBack: () => void
}

export function OnboardingStep2({ defaultValues, onNext, onBack }: OnboardingStep2Props) {
  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      graduation_year: undefined,
      department: '',
      current_position: '',
      current_company: '',
      industry: '',
      linkedin_url: '',
      website_url: '',
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="graduation_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Έτος αποφοίτησης</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value ? Number(e.target.value) : undefined)
                    }
                  >
                    <option value="">Επιλέξτε έτος</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τμήμα / Σχολή</FormLabel>
                <FormControl>
                  <Input placeholder="π.χ. Τμήμα Πληροφορικής" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="current_position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Τρέχουσα θέση</FormLabel>
              <FormControl>
                <Input placeholder="π.χ. Senior Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="current_company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Εταιρεία</FormLabel>
              <FormControl>
                <Input placeholder="π.χ. Google" {...field} />
              </FormControl>
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
              <FormControl>
                <Input placeholder="π.χ. Τεχνολογία, Ναυτιλία, Χρηματοδότηση" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedin_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Προσωπική ιστοσελίδα</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://yoursite.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            ← Πίσω
          </Button>
          <Button type="submit">Επόμενο →</Button>
        </div>
      </form>
    </Form>
  )
}
