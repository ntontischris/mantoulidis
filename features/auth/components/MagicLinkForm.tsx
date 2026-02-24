'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignIn } from '../hooks/useSignIn'
import { magicLinkSchema, type MagicLinkFormData } from '../schemas/auth.schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface MagicLinkFormProps {
  locale: string
  onSuccess?: () => void
}

export function MagicLinkForm({ locale, onSuccess }: MagicLinkFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const { signInWithMagicLink, isPending } = useSignIn(locale)

  const form = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: MagicLinkFormData) => {
    setServerError(null)
    const result = await signInWithMagicLink(data.email)
    if (result.error) {
      setServerError(result.error)
    } else {
      setSent(true)
      onSuccess?.()
    }
  }

  if (sent) {
    return (
      <Alert>
        <p className="text-sm font-medium">Ελέγξτε το email σας!</p>
        <p className="text-sm text-muted-foreground mt-1">
          Σας στείλαμε σύνδεσμο σύνδεσης στο {form.getValues('email')}
        </p>
      </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <p className="text-sm">{serverError}</p>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Αποστολή...' : 'Αποστολή Magic Link'}
        </Button>
      </form>
    </Form>
  )
}
