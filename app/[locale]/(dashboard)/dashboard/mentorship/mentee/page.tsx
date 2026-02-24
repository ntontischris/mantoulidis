'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MenteeDashboard } from '@/features/mentorship/components/MenteeDashboard'

export default function MenteePage() {
  const { locale } = useParams<{ locale: string }>()

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Οι αιτήσεις μου</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mentorships που έχετε ζητήσει
          </p>
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
