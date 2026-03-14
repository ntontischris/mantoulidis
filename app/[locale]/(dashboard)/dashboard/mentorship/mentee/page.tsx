import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MenteeDashboard } from '@/features/mentorship/components/MenteeDashboard'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function MenteePage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Οι αιτήσεις μου</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mentorships που έχετε ζητήσει</p>
        </div>
        <Link
          href={`/${locale}/dashboard/mentorship`}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Εύρεση Mentor
        </Link>
      </div>

      <MenteeDashboard />
    </div>
  )
}
