'use client'

import { useState, useCallback } from 'react'
import { useBenefits } from '@/features/benefits/hooks/useBenefits'
import { BenefitCard } from '@/features/benefits/components/BenefitCard'
import { BenefitFiltersPanel } from '@/features/benefits/components/BenefitFilters'
import { PageHeader } from '@/components/shared/PageHeader'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import type { BenefitFilters } from '@/features/benefits/types'

interface BenefitsPageContentProps {
  locale: string
}

export function BenefitsPageContent({ locale }: BenefitsPageContentProps) {
  const [filters, setFilters] = useState<BenefitFilters>({ activeOnly: true })
  const [search, setSearch] = useState('')

  const activeQuery: BenefitFilters = { ...filters, search: search || undefined }
  const { data: benefits, isLoading } = useBenefits(activeQuery)

  const handleFiltersChange = useCallback((f: BenefitFilters) => {
    setFilters(f)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Παροχές Μελών"
        subtitle="Αποκλειστικές προσφορές και εκπτώσεις για αποφοίτους"
      />

      {/* Search */}
      <Input
        placeholder="Αναζήτηση παροχής ή συνεργάτη..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-lg"
      />

      {/* Category filters */}
      <BenefitFiltersPanel filters={filters} onChange={handleFiltersChange} />

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : !benefits || benefits.length === 0 ? (
        <EmptyState
          title="Δεν βρέθηκαν παροχές"
          description="Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
