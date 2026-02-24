import type { EventRow, EventRsvpRow } from '@/lib/supabase/types'

export type Event = EventRow
export type EventRsvp = EventRsvpRow

export interface EventFilters {
  status?: 'published' | 'completed' | 'draft' | 'cancelled'
  type?: 'in_person' | 'virtual' | 'hybrid'
  upcoming?: boolean
  // true = start_date >= now, false = past events
  search?: string
}

export const EVENT_TYPE_LABELS: Record<Event['type'], string> = {
  in_person: 'Δια ζώσης',
  virtual: 'Διαδικτυακή',
  hybrid: 'Υβριδική',
}

export const EVENT_STATUS_LABELS: Record<Event['status'], string> = {
  draft: 'Πρόχειρο',
  published: 'Δημοσιευμένο',
  cancelled: 'Ακυρώθηκε',
  completed: 'Ολοκληρώθηκε',
}
