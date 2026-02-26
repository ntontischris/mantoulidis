'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAdminUsers, useBulkUpdateUsers } from '@/features/admin/hooks/useAdmin'
import type { ProfileRow } from '@/lib/supabase/types'

const ROLE_LABELS: Record<string, string> = {
  basic_member: 'Βασικό',
  verified_member: 'Verified',
  admin: 'Admin',
  super_admin: 'Super Admin',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-muted text-muted-foreground',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function AdminUsersPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const { data: users, isLoading, isError, error } = useAdminUsers(search)
  const { mutate: bulkUpdate, isPending } = useBulkUpdateUsers()

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (!users) return
    if (selected.size === users.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(users.map((u) => u.id)))
    }
  }

  function handleBulkAction(updates: Partial<Pick<ProfileRow, 'role' | 'membership_status'>>) {
    if (selected.size === 0) return
    bulkUpdate(
      { userIds: Array.from(selected), updates },
      { onSuccess: () => setSelected(new Set()) }
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Διαχείριση Χρηστών</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Αναζήτηση, επαλήθευση και διαχείριση μελών
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Αναζήτηση ονόματος ή αρ. μέλους..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 max-w-sm flex-1 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {selected.size > 0 && (
          <div className="flex gap-2 text-sm">
            <span className="py-1 text-muted-foreground">{selected.size} επιλεγμένα</span>
            <button
              disabled={isPending}
              onClick={() => handleBulkAction({ role: 'verified_member' })}
              className="rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              Verify
            </button>
            <button
              disabled={isPending}
              onClick={() => handleBulkAction({ membership_status: 'active' })}
              className="rounded-lg bg-green-600 px-3 py-1.5 font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              Ενεργοποίηση
            </button>
            <button
              disabled={isPending}
              onClick={() => handleBulkAction({ membership_status: 'suspended' })}
              className="rounded-lg bg-destructive px-3 py-1.5 font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              Αναστολή
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={users ? selected.size === users.length && users.length > 0 : false}
                  onChange={toggleAll}
                  className="rounded border-border"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Μέλος</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Αρ. Μέλους</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ρόλος</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Κατάσταση</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Εγγραφή</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-destructive">
                  ⚠️ Σφάλμα φόρτωσης:{' '}
                  {(error as Error)?.message ?? 'Αδυναμία σύνδεσης με τη βάση δεδομένων'}
                </td>
              </tr>
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={(e) => {
                    // Don't navigate when clicking checkbox
                    if ((e.target as HTMLElement).tagName === 'INPUT') return
                    router.push(`/${locale}/admin/users/${user.id}`)
                  }}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {user.first_name} {user.last_name}
                      </p>
                      {user.current_position && (
                        <p className="text-xs text-muted-foreground">{user.current_position}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {user.membership_number ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs">{ROLE_LABELS[user.role] ?? user.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[user.membership_status] ?? ''}`}
                    >
                      {user.membership_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString('el-GR')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Δεν βρέθηκαν χρήστες
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
