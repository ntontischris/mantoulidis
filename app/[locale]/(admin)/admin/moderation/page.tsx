'use client'

import { useModerationQueue, useModerationAction } from '@/features/admin/hooks/useAdmin'

export default function ModerationPage() {
  const { data: items, isLoading } = useModerationQueue()
  const { mutate: takeAction, isPending } = useModerationAction()

  const TYPE_LABELS = {
    business: 'Επιχείρηση',
    story: 'Ιστορία Επιτυχίας',
  }

  const TYPE_COLORS = {
    business: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    story: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Moderation Queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Έλεγχος επιχειρήσεων και ιστοριών επιτυχίας
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[item.type]}`}>
                    {TYPE_LABELS[item.type]}
                  </span>
                  <span className="font-medium text-foreground truncate">{item.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Από: {item.owner_name} · {new Date(item.created_at).toLocaleDateString('el-GR')}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  disabled={isPending}
                  onClick={() => takeAction({ type: item.type, id: item.id, approve: false })}
                  className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
                >
                  Απόρριψη
                </button>
                <button
                  disabled={isPending}
                  onClick={() => takeAction({ type: item.type, id: item.id, approve: true })}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  Έγκριση
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-3xl">✅</p>
          <p className="mt-3 font-medium text-foreground">Δεν υπάρχουν εκκρεμή αιτήματα</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Όλο το περιεχόμενο έχει ελεγχθεί
          </p>
        </div>
      )}
    </div>
  )
}
