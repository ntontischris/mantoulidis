import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DirectoryPageContent } from '@/features/directory/components/DirectoryPageContent'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function DirectoryPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  return <DirectoryPageContent locale={locale} />
}
