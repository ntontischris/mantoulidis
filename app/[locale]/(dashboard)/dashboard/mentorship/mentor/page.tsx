'use client'

import { MentorDashboard } from '@/features/mentorship/components/MentorDashboard'

export default function MentorPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mentor Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Αιτήσεις mentorship που έχετε λάβει
        </p>
      </div>

      <MentorDashboard />
    </div>
  )
}
