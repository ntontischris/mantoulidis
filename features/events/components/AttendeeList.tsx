'use client'

import { Avatar } from '@/components/shared/Avatar'
import { useEventAttendees } from '../hooks/useEvents'

interface AttendeeListProps {
  eventId: string
  totalCount: number
}

export function AttendeeList({ eventId, totalCount }: AttendeeListProps) {
  const { data: attendees, isLoading } = useEventAttendees(eventId, 8)

  if (isLoading || !attendees || attendees.length === 0) return null

  const extra = totalCount - attendees.length

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        Συμμετέχοντες ({totalCount})
      </h2>
      <div className="flex items-center gap-1 flex-wrap">
        {attendees.map((rsvp) => {
          const profile = Array.isArray(rsvp.profiles) ? rsvp.profiles[0] : rsvp.profiles
          if (!profile) return null
          return (
            <Avatar
              key={rsvp.user_id}
              src={(profile as { avatar_url: string | null }).avatar_url}
              name={`${(profile as { first_name: string }).first_name} ${(profile as { last_name: string }).last_name}`}
              size="sm"
            />
          )
        })}
        {extra > 0 && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            +{extra}
          </div>
        )}
      </div>
    </div>
  )
}
