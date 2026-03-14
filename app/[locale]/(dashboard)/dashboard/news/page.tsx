import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewsPageContent } from '@/features/news/components/NewsPageContent'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function NewsPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  return <NewsPageContent locale={locale} />
}
