import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditJobPageClient } from '@/features/jobs/components/EditJobPageClient'

interface PageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditJobPage({ params }: PageProps) {
  const { locale, id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: job } = await supabase
    .from('jobs')
    .select(
      'id, title, title_en, company, description, description_en, type, location, is_remote, salary_range, apply_url, apply_email, industry, expires_at'
    )
    .eq('id', id)
    .single()

  if (!job) notFound()

  return <EditJobPageClient locale={locale} id={id} job={job} />
}
