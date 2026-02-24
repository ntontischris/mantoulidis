'use client'

import { useMyMenteeMentorships, useUpdateMentorshipStatus } from '../hooks/useMentorship'
import { MentorshipStatusBadge } from './MentorshipStatus'

export function MenteeDashboard() {
  const { data: mentorships, isLoading } = useMyMenteeMentorships()
  const { mutate: updateStatus, isPending } = useUpdateMentorshipStatus()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  if (!mentorships || mentorships.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        Δεν έχετε κάνει αιτήσεις mentorship ακόμα.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {mentorships.map((m) => (
        <div key={m.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">
                {m.mentor?.first_name} {m.mentor?.last_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {[m.mentor?.current_position, m.mentor?.current_company].filter(Boolean).join(' @ ')}
              </p>
              {m.goals && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  <span className="font-medium text-foreground">Στόχοι:</span> {m.goals}
                </p>
              )}
            </div>
            <MentorshipStatusBadge status={m.status} />
          </div>

          {/* Actions */}
          {(m.status === 'pending' || m.status === 'active') && (
            <div className="mt-3 flex justify-end border-t border-border pt-3">
              <button
                disabled={isPending}
                onClick={() => updateStatus({ mentorshipId: m.id, status: 'cancelled' })}
                className="text-xs text-destructive hover:underline disabled:opacity-50"
              >
                Ακύρωση αίτησης
              </button>
            </div>
          )}

          {/* Dates */}
          <div className="mt-2 text-xs text-muted-foreground">
            Αίτηση: {new Date(m.created_at).toLocaleDateString('el-GR')}
            {m.started_at && ` · Έναρξη: ${new Date(m.started_at).toLocaleDateString('el-GR')}`}
            {m.completed_at && ` · Ολοκλήρωση: ${new Date(m.completed_at).toLocaleDateString('el-GR')}`}
          </div>
        </div>
      ))}
    </div>
  )
}
