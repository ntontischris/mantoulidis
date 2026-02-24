'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { updatePasswordSchema, type UpdatePasswordFormData } from '@/features/auth/schemas/auth.schemas'
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

export default function UpdatePasswordPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setIsPending(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error: supaError } = await supabase.auth.updateUser({
        password: data.password,
      })
      if (supaError) {
        setError('Σφάλμα ενημέρωσης κωδικού. Παρακαλώ δοκιμάστε ξανά.')
      } else {
        router.push(`/${locale}/dashboard/home`)
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Νέος κωδικός
        </h1>
        <p className="text-sm text-muted-foreground">
          Εισάγετε τον νέο σας κωδικό πρόσβασης.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Νέος κωδικός</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Επιβεβαίωση κωδικού</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Ενημέρωση...' : 'Ενημέρωση κωδικού'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
