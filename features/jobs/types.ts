import type { JobRow, JobType, JobStatus } from '@/lib/supabase/types'

export type Job = JobRow & {
  poster?: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string | null
  } | null
  is_saved?: boolean
}

export interface JobFilters {
  search?: string
  type?: JobType
  status?: JobStatus
  industry?: string
  is_remote?: boolean
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: 'Πλήρης Απασχόληση',
  part_time: 'Μερική Απασχόληση',
  contract: 'Σύμβαση',
  internship: 'Πρακτική',
  freelance: 'Freelance',
  volunteer: 'Εθελοντισμός',
}

export const JOB_TYPE_LABELS_EN: Record<JobType, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
}
