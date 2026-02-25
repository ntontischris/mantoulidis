'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGroups } from '@/features/groups/hooks/useGroups'
import { GroupCard } from '@/features/groups/components/GroupCard'

export default function GroupsPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { data: groups, isLoading } = useGroups()

  const filtered = (groups ?? []).filter((g) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      g.name.toLowerCase().includes(q) ||
      (g.name_en ?? '').toLowerCase().includes(q) ||
      (g.description ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ομάδες</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Κοινότητες αποφοίτων με κοινά ενδιαφέροντα
          </p>
        </div>
        <button
          onClick={() => router.push(`/${locale}/dashboard/groups/new`)}
          className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          + Νέα Ομάδα
        </button>
      </div>

      <input
        type="search"
        placeholder="Αναζήτηση ομάδας..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9 w-full max-w-sm rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <GroupCard key={g.id} group={g} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-3xl">👥</p>
          <p className="mt-3 font-medium text-foreground">Δεν βρέθηκαν ομάδες</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Δημιουργήστε μια νέα ομάδα για την κοινότητά σας
          </p>
        </div>
      )}
    </div>
  )
}
