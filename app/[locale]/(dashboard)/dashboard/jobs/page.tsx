import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { JobsPageContent } from '@/features/jobs/components/JobsPageContent'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function JobsPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  return <JobsPageContent locale={locale} />
}
