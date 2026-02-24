import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { GoogleOAuthButton } from '@/features/auth/components/GoogleOAuthButton'
import { MagicLinkForm } from '@/features/auth/components/MagicLinkForm'

interface LoginPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth.login' })
  return { title: t('title') }
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
          AC
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Σύνδεση
        </h1>
        <p className="text-sm text-muted-foreground">
          Συνδεθείτε στον λογαριασμό σας
        </p>
      </div>

      <GoogleOAuthButton locale={locale} />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">ή με email</span>
        <Separator className="flex-1" />
      </div>

      <LoginForm locale={locale} />

      <div className="text-center">
        <Link
          href={`/${locale}/forgot-password`}
          className="text-sm text-primary hover:underline"
        >
          Ξεχάσατε τον κωδικό σας;
        </Link>
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-center text-xs text-muted-foreground">
          ή σύνδεση χωρίς κωδικό
        </p>
        <MagicLinkForm locale={locale} />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Δεν έχετε λογαριασμό;{' '}
        <Link
          href={`/${locale}/register`}
          className="font-medium text-primary hover:underline"
        >
          Εγγραφή
        </Link>
      </p>
    </div>
  )
}
