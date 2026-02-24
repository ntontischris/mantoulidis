'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { DirectoryFilters } from '../types'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1990 + 1 }, (_, i) => CURRENT_YEAR - i)

const INDUSTRIES = [
  'Τεχνολογία', 'Ναυτιλία', 'Χρηματοδότηση', 'Υγεία', 'Εκπαίδευση',
  'Κατασκευές', 'Εμπόριο', 'Τουρισμός', 'Ενέργεια', 'Νομικά', 'Άλλο',
]

interface DirectoryFiltersProps {
  filters: DirectoryFilters
  onChange: (filters: DirectoryFilters) => void
  onReset: () => void
}

export function DirectoryFiltersPanel({ filters, onChange, onReset }: DirectoryFiltersProps) {
  const hasActiveFilters =
    !!filters.industry || !!filters.graduation_year || filters.is_mentor !== undefined

  return (
    <div className="space-y-5 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Φίλτρα</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-primary hover:underline"
          >
            Καθαρισμός
          </button>
        )}
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Κλάδος</Label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() =>
                onChange({ ...filters, industry: filters.industry === ind ? undefined : ind })
              }
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                filters.industry === ind
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Graduation year */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Έτος αποφοίτησης
        </Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          value={filters.graduation_year ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              graduation_year: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        >
          <option value="">Όλα τα έτη</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Is Mentor */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Ρόλος</Label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={filters.is_mentor === true}
              onChange={(e) =>
                onChange({ ...filters, is_mentor: e.target.checked ? true : undefined })
              }
              className="h-4 w-4 rounded border-border accent-primary"
            />
            Μόνο Μέντορες
          </label>
        </div>
      </div>

      {/* Membership status */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Κατάσταση</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          value={filters.membership_status ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              membership_status: (e.target.value as 'active' | 'inactive') || undefined,
            })
          }
        >
          <option value="">Όλοι</option>
          <option value="active">Ενεργά μέλη</option>
          <option value="inactive">Ανενεργά</option>
        </select>
      </div>
    </div>
  )
}
