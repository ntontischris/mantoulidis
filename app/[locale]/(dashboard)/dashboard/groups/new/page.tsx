import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { GroupForm } from '@/features/groups/components/GroupForm'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function NewGroupPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  return <GroupForm locale={locale} />
}
