'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step3Schema, type Step3Data } from '../schemas/onboarding.schemas'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface OnboardingStep3Props {
  defaultValues?: Partial<Step3Data>
  onNext: (data: Step3Data) => void
  onBack: () => void
}

export function OnboardingStep3({ defaultValues, onNext, onBack }: OnboardingStep3Props) {
  const form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      bio: '',
      bio_en: '',
      is_mentor: false,
      ...defaultValues,
    },
  })

  const bioLength = form.watch('bio')?.length ?? 0

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Βιογραφικό (GR)</FormLabel>
                <span className="text-xs text-muted-foreground">{bioLength}/5000</span>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Πείτε μας λίγα λόγια για εσάς, την καριέρα σας και τα ενδιαφέροντά σας..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio_en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio (EN)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about yourself, your career and interests..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>Προαιρετικό — αγγλική εκδοχή</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_mentor"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                <input
                  type="checkbox"
                  id="is_mentor"
                  checked={field.value}
                  onChange={field.onChange}
                  className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border accent-primary"
                />
                <div>
                  <FormLabel htmlFor="is_mentor" className="cursor-pointer font-medium">
                    Θέλω να γίνω Μέντορας
                  </FormLabel>
                  <FormDescription className="mt-0.5">
                    Ως μέντορας μπορείτε να καθοδηγείτε νεότερους αποφοίτους στην καριέρα τους.
                  </FormDescription>
                </div>
              </div>
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
