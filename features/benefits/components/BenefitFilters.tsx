'use client'

import { Button } from '@/components/ui/button'
import { BENEFIT_CATEGORIES } from '../types'
import type { BenefitFilters } from '../types'

interface BenefitFiltersPanelProps {
  filters: BenefitFilters
  onChange: (f: BenefitFilters) => void
}

export function BenefitFiltersPanel({ filters, onChange }: BenefitFiltersPanelProps) {
  const toggleCategory = (value: string) => {
    onChange({
      ...filters,
      category: filters.category === value ? undefined : value,
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={!filters.category ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange({ ...filters, category: undefined })}
      >
        Όλα
      </Button>
      {BENEFIT_CATEGORIES.map((cat) => (
        <Button
          key={cat.value}
          variant={filters.category === cat.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleCategory(cat.value)}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  )
}
