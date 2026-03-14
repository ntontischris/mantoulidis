import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewJobPageClient } from '@/features/jobs/components/NewJobPageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function NewJobPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  return <NewJobPageClient locale={locale} />
}
