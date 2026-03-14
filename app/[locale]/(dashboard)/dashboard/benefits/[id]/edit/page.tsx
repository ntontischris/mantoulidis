import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditBenefitPageClient } from '@/features/benefits/components/EditBenefitPageClient'

interface PageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function EditBenefitPage({ params }: PageProps) {
  const { locale, id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: benefit } = await supabase.from('benefits').select('*').eq('id', id).single()

  if (!benefit) notFound()

  return <EditBenefitPageClient locale={locale} id={id} benefit={benefit} />
}
