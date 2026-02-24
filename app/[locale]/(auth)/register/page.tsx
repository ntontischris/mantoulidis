'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { GoogleOAuthButton } from '@/features/auth/components/GoogleOAuthButton'

export default function RegisterPage() {
  const { locale } = useParams<{ locale: string }>()
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-3xl">
          ✉️
        </div>
        <h2 className="text-xl font-bold">Ελέγξτε το email σας</h2>
        <p className="text-sm text-muted-foreground">
          Σας στείλαμε σύνδεσμο επιβεβαίωσης. Επιβεβαιώστε το email σας για να
          ολοκληρώσετε την εγγραφή.
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
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
          AC
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Εγγραφή
        </h1>
        <p className="text-sm text-muted-foreground">
          Δημιουργήστε τον λογαριασμό σας
        </p>
      </div>

      <GoogleOAuthButton locale={locale} label="Εγγραφή με Google" />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">ή με email</span>
        <Separator className="flex-1" />
      </div>

      <RegisterForm onSuccess={(needsConfirmation) => {
        if (needsConfirmation) setConfirmed(true)
      }} />

      <p className="text-center text-sm text-muted-foreground">
        Έχετε ήδη λογαριασμό;{' '}
        <Link
          href={`/${locale}/login`}
          className="font-medium text-primary hover:underline"
        >
          Σύνδεση
        </Link>
      </p>
    </div>
  )
}
