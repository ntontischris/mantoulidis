'use client'

import { useState, useCallback } from 'react'
import { useDirectory } from '@/features/directory/hooks/useDirectory'
import { MemberCard } from '@/features/directory/components/MemberCard'
import { DirectoryFiltersPanel } from '@/features/directory/components/DirectoryFilters'
import { DirectoryViewToggle } from '@/features/directory/components/DirectoryViewToggle'
import { PageHeader } from '@/components/shared/PageHeader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import type { DirectoryFilters } from '@/features/directory/types'

interface DirectoryPageContentProps {
  locale: string
}

export function DirectoryPageContent({ locale }: DirectoryPageContentProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<DirectoryFilters>({})

  const activeQuery = { ...activeFilters, search: search || undefined }
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useDirectory(activeQuery)

  const members = data?.pages.flat() ?? []

  const handleFiltersChange = useCallback((f: DirectoryFilters) => {
    setActiveFilters(f)
  }, [])

  const handleReset = useCallback(() => {
    setActiveFilters({})
    setSearch('')
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Κατάλογος Αποφοίτων"
        subtitle={`${members.length > 0 ? `${members.length}+` : '0'} μέλη`}
        action={<DirectoryViewToggle view={view} onChange={setView} />}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="w-full shrink-0 lg:w-64">
          <DirectoryFiltersPanel
            filters={activeFilters}
            onChange={handleFiltersChange}
            onReset={handleReset}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 space-y-4">
          {/* Search bar */}
          <Input
            placeholder="Αναζήτηση μέλους, θέσης, εταιρείας..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-lg"
          />

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : members.length === 0 ? (
            <EmptyState
              title="Δεν βρέθηκαν μέλη"
              description="Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης"
            />
          ) : (
            <>
              <div
                className={
                  view === 'grid'
                    ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4'
                    : 'flex flex-col gap-3'
                }
              >
                {members.map((member) => (
                  <MemberCard key={member.id} member={member} locale={locale} view={view} />
                ))}
              </div>

              {/* Load more */}
              {hasNextPage && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? 'Φόρτωση...' : 'Περισσότερα'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
