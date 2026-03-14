import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsContent } from '@/features/settings/components/SettingsContent'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function SettingsPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  return <SettingsContent locale={locale} />
}
