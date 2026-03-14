import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BenefitsPageContent } from '@/features/benefits/components/BenefitsPageContent'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function BenefitsPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  return <BenefitsPageContent locale={locale} />
}
