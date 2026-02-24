import type { MentorshipRow, MentorshipStatus, ProfileRow } from '@/lib/supabase/types'

export type MentorProfile = Pick<
  ProfileRow,
  | 'id'
  | 'first_name'
  | 'last_name'
  | 'avatar_url'
  | 'current_position'
  | 'current_company'
  | 'industry'
  | 'bio'
>

export type Mentorship = MentorshipRow & {
  mentor?: MentorProfile | null
  mentee?: MentorProfile | null
}

export interface MentorFilters {
  search?: string
  industry?: string
}

export const MENTORSHIP_STATUS_LABELS: Record<MentorshipStatus, string> = {
  pending: 'Αναμονή',
  accepted: 'Αποδεκτό',
  declined: 'Απορρίφθηκε',
  active: 'Ενεργό',
  completed: 'Ολοκληρώθηκε',
  cancelled: 'Ακυρώθηκε',
}

export const MENTORSHIP_STATUS_COLORS: Record<MentorshipStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  accepted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  declined: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-primary/10 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
}
