import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { GroupsPageContent } from '@/features/groups/components/GroupsPageContent'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function GroupsPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  return <GroupsPageContent locale={locale} />
}
