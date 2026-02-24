'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEvents } from '@/features/events/hooks/useEvents'
import { EventCard } from '@/features/events/components/EventCard'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import type { EventFilters } from '@/features/events/types'

type Tab = 'upcoming' | 'past'

export default function EventsPage() {
  const { locale } = useParams<{ locale: string }>()
  const { profile } = useAuth()
  const [tab, setTab] = useState<Tab>('upcoming')
  const [search, setSearch] = useState('')

  const canCreate =
    profile?.role === 'verified_member' ||
    profile?.role === 'admin' ||
    profile?.role === 'super_admin'

  const filters: EventFilters = {
    upcoming: tab === 'upcoming',
    search: search || undefined,
  }

  const { data: events, isLoading } = useEvents(filters)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Εκδηλώσεις"
        subtitle="Εκδηλώσεις και δραστηριότητες της κοινότητας"
        action={
          canCreate ? (
            <Button asChild size="sm">
              <Link href={`/${locale}/dashboard/events/new`}>+ Νέα Εκδήλωση</Link>
            </Button>
          ) : undefined
        }
      />

      {/* Tabs + Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            variant={tab === 'upcoming' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTab('upcoming')}
          >
            Προσεχείς
          </Button>
          <Button
            variant={tab === 'past' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTab('past')}
          >
            Παλαιότερες
          </Button>
        </div>
        <Input
          placeholder="Αναζήτηση εκδήλωσης..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : !events || events.length === 0 ? (
        <EmptyState
          title={tab === 'upcoming' ? 'Δεν υπάρχουν προσεχείς εκδηλώσεις' : 'Δεν υπάρχουν παλαιότερες εκδηλώσεις'}
          description={
            canCreate && tab === 'upcoming'
              ? 'Δημιουργήστε την πρώτη εκδήλωση της κοινότητας'
              : 'Σύντομα!'
          }
          action={
            canCreate && tab === 'upcoming' ? (
              <Button asChild size="sm">
                <Link href={`/${locale}/dashboard/events/new`}>+ Νέα Εκδήλωση</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
