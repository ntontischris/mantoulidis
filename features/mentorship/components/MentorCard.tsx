'use client'

import type { MentorProfile } from '../types'

interface MentorCardProps {
  mentor: MentorProfile
  onRequest: (mentorId: string) => void
  hasExisting?: boolean
}

export function MentorCard({ mentor, onRequest, hasExisting }: MentorCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {mentor.first_name[0]}{mentor.last_name[0]}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">
            {mentor.first_name} {mentor.last_name}
          </p>
          {(mentor.current_position || mentor.current_company) && (
            <p className="truncate text-sm text-muted-foreground">
              {[mentor.current_position, mentor.current_company].filter(Boolean).join(' @ ')}
            </p>
          )}
        </div>
      </div>

      {/* Industry */}
      {mentor.industry && (
        <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {mentor.industry}
        </span>
      )}

      {/* Bio snippet */}
      {mentor.bio && (
        <p className="text-sm text-muted-foreground line-clamp-3">{mentor.bio}</p>
      )}

      {/* Action */}
      <button
        type="button"
        disabled={hasExisting}
        onClick={() => onRequest(mentor.id)}
        className="mt-auto rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {hasExisting ? 'Ήδη αιτήθηκες' : 'Αίτηση Mentorship'}
      </button>
    </div>
  )
}
