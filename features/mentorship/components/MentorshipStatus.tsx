'use client'

import { MENTORSHIP_STATUS_LABELS, MENTORSHIP_STATUS_COLORS } from '../types'
import type { MentorshipStatus as MentorshipStatusType } from '@/lib/supabase/types'

interface MentorshipStatusBadgeProps {
  status: MentorshipStatusType
}

export function MentorshipStatusBadge({ status }: MentorshipStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${MENTORSHIP_STATUS_COLORS[status]}`}
    >
      {MENTORSHIP_STATUS_LABELS[status]}
    </span>
  )
}
