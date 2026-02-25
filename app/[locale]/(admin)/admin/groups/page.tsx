'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAdminGroups, useAdminDeleteGroup } from '@/features/admin/hooks/useAdmin'

export default function AdminGroupsPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const { data: groups, isLoading } = useAdminGroups()
  const { mutate: deleteGroup } = useAdminDeleteGroup()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Διαχείριση Ομάδων</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Επισκόπηση και διαχείριση ομάδων μελών
          </p>
        </div>
        <button
          onClick={() => router.push(`/${locale}/dashboard/groups/new`)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Νέα Ομάδα
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Όνομα</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Τύπος</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Μέλη</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Ημερομηνία
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ενέργειες</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {groups && groups.length > 0 ? (
                groups.map((g) => (
                  <tr key={g.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{g.name}</p>
                      {g.description && (
                        <p className="max-w-xs truncate text-xs text-muted-foreground">
                          {g.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          g.is_private
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {g.is_private ? 'Ιδιωτική' : 'Δημόσια'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{g.member_count}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(g.created_at).toLocaleDateString('el-GR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/${locale}/dashboard/groups/${g.id}`)}
                          className="text-xs text-foreground hover:underline"
                        >
                          Προβολή
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Να διαγραφεί η ομάδα "${g.name}";`)) {
                              deleteGroup(g.id)
                            }
                          }}
                          className="text-xs text-destructive hover:underline"
                        >
                          Διαγ.
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Δεν υπάρχουν ομάδες
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
