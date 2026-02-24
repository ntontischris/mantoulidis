import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Providers } from '@/components/providers'
import '../globals.css'

const inter = Inter({
  subsets: ['latin', 'greek'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Alumni Connect',
    template: '%s | Alumni Connect',
  },
  description: 'Η πλατφόρμα δικτύωσης αποφοίτων',
  keywords: ['alumni', 'αποφοίτοι', 'δικτύωση', 'mentorship'],
  openGraph: {
    type: 'website',
    locale: 'el_GR',
    siteName: 'Alumni Connect',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as 'el' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
