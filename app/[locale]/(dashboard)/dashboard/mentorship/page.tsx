import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MentorshipPageContent } from '@/features/mentorship/components/MentorshipPageContent'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function MentorshipPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  return <MentorshipPageContent locale={locale} />
}
