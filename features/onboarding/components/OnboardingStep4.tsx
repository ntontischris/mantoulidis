'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step4Schema, type Step4Data } from '../schemas/onboarding.schemas'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface OnboardingStep4Props {
  defaultValues?: Partial<Step4Data>
  onSubmit: (data: Step4Data) => void
  onBack: () => void
  isPending: boolean
}

export function OnboardingStep4({ defaultValues, onSubmit, onBack, isPending }: OnboardingStep4Props) {
  const form = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      email_public: true,
      phone_public: false,
      language_pref: 'el',
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Ρυθμίσεις απορρήτου</h3>

          <FormField
            control={form.control}
            name="email_public"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <FormLabel className="font-medium">Δημόσιο email</FormLabel>
                    <FormDescription>
                      Άλλοι χρήστες μπορούν να βλέπουν το email σας
                    </FormDescription>
                  </div>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_public"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <FormLabel className="font-medium">Δημόσιο τηλέφωνο</FormLabel>
                    <FormDescription>
                      Άλλοι χρήστες μπορούν να βλέπουν το τηλέφωνό σας
                    </FormDescription>
                  </div>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="language_pref"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Προτιμώμενη γλώσσα</FormLabel>
              <FormControl>
                <div className="flex gap-3">
                  {(['el', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => field.onChange(lang)}
                      className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                        field.value === lang
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {lang === 'el' ? '🇬🇷 Ελληνικά' : '🇬🇧 English'}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
            ← Πίσω
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Αποθήκευση...' : 'Ολοκλήρωση εγγραφής'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
