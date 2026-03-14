import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MentorDashboard } from '@/features/mentorship/components/MentorDashboard'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function MentorPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mentor Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Αιτήσεις mentorship που έχετε λάβει</p>
      </div>

      <MentorDashboard />
    </div>
  )
}
