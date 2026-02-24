'use client'

import { JOB_TYPE_LABELS } from '../types'
import type { JobFilters } from '../types'
import type { JobType as DBJobType } from '@/lib/supabase/types'

interface JobFiltersProps {
  filters: JobFilters
  onChange: (filters: JobFilters) => void
}

const JOB_TYPES: DBJobType[] = ['full_time', 'part_time', 'contract', 'internship', 'freelance', 'volunteer']

export function JobFiltersBar({ filters, onChange }: JobFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Search */}
      <input
        type="search"
        placeholder="Αναζήτηση θέσης ή εταιρείας..."
        value={filters.search ?? ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
        className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Type filter */}
      <select
        value={filters.type ?? ''}
        onChange={(e) =>
          onChange({ ...filters, type: (e.target.value as DBJobType) || undefined })
        }
        className="h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">Όλοι οι τύποι</option>
        {JOB_TYPES.map((t) => (
          <option key={t} value={t}>
            {JOB_TYPE_LABELS[t]}
          </option>
        ))}
      </select>

      {/* Remote toggle */}
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.is_remote ?? false}
          onChange={(e) =>
            onChange({ ...filters, is_remote: e.target.checked ? true : undefined })
          }
          className="rounded border-border"
        />
        Remote μόνο
      </label>
    </div>
  )
}
