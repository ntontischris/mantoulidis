'use client'

import { Button } from '@/components/ui/button'
import { useMyRsvp, useEventRSVP } from '../hooks/useEvents'
import type { Event } from '../types'

interface EventRSVPButtonProps {
  event: Event
}

export function EventRSVPButton({ event }: EventRSVPButtonProps) {
  const { data: myRsvp, isLoading } = useMyRsvp(event.id)
  const { rsvp, cancel } = useEventRSVP(event.id)

  const isUpcoming = new Date(event.start_date) > new Date()
  const isFull = event.capacity !== null && event.rsvp_count >= event.capacity

  if (!isUpcoming || event.status !== 'published') {
    return null
  }

  if (isLoading) {
    return (
      <Button disabled className="w-full sm:w-auto">
        Φόρτωση...
      </Button>
    )
  }

  // Already attending
  if (myRsvp?.status === 'attending') {
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          ✓ Έχεις εγγραφεί
        </div>
        <Button
          variant="outline"
          onClick={() => cancel.mutate()}
          disabled={cancel.isPending}
          className="w-full sm:w-auto"
        >
          {cancel.isPending ? 'Ακύρωση...' : 'Ακύρωση εγγραφής'}
        </Button>
      </div>
    )
  }

  // On waitlist
  if (myRsvp?.status === 'waitlist') {
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
          ⏳ Σε λίστα αναμονής
        </div>
        <Button
          variant="outline"
          onClick={() => cancel.mutate()}
          disabled={cancel.isPending}
          className="w-full sm:w-auto"
        >
          {cancel.isPending ? 'Ακύρωση...' : 'Αποχώρηση από λίστα'}
        </Button>
      </div>
    )
  }

  // Previously cancelled — can re-RSVP
  if (myRsvp?.status === 'cancelled') {
    return (
      <Button
        onClick={() => rsvp.mutate()}
        disabled={rsvp.isPending}
        className="w-full sm:w-auto"
      >
        {rsvp.isPending ? 'Εγγραφή...' : isFull ? 'Λίστα αναμονής' : 'Εγγραφή'}
      </Button>
    )
  }

  // Not RSVPed yet
  return (
    <Button
      onClick={() => rsvp.mutate()}
      disabled={rsvp.isPending}
      variant={isFull ? 'outline' : 'default'}
      className="w-full sm:w-auto"
    >
      {rsvp.isPending
        ? 'Εγγραφή...'
        : isFull
          ? 'Λίστα αναμονής'
          : 'Εγγραφή'}
    </Button>
  )
}
