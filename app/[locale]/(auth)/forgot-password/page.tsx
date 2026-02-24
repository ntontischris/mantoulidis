'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/features/auth/schemas/auth.schemas'
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

export default function ForgotPasswordPage() {
  const { locale } = useParams<{ locale: string }>()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsPending(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error: supaError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/${locale}/update-password`,
      })
      if (supaError) {
        setError('Σφάλμα αποστολής. Παρακαλώ δοκιμάστε ξανά.')
      } else {
        setSent(true)
      }
    } finally {
      setIsPending(false)
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-3xl">
          ✉️
        </div>
        <h2 className="text-xl font-bold">Ελέγξτε το email σας</h2>
        <p className="text-sm text-muted-foreground">
          Σας στείλαμε οδηγίες για επαναφορά κωδικού στο {form.getValues('email')}.
        </p>
        <Link href={`/${locale}/login`} className="text-sm text-primary hover:underline block">
          Επιστροφή στη σύνδεση
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Ξεχάσατε τον κωδικό;
        </h1>
        <p className="text-sm text-muted-foreground">
          Εισάγετε το email σας και θα σας στείλουμε οδηγίες επαναφοράς.
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Αποστολή...' : 'Αποστολή οδηγιών'}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Θυμηθήκατε τον κωδικό;{' '}
        <Link href={`/${locale}/login`} className="font-medium text-primary hover:underline">
          Σύνδεση
        </Link>
      </p>
    </div>
  )
}
