'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  useAdminEvents,
  useAdminUpdateEvent,
  useAdminDeleteEvent,
} from '@/features/admin/hooks/useAdmin'
import type { EventRow } from '@/lib/supabase/types'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  published: 'Δημοσιευμένο',
  cancelled: 'Ακυρωμένο',
  completed: 'Ολοκληρωμένο',
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}

const TYPE_LABELS: Record<string, string> = {
  in_person: 'Φυσική Παρουσία',
  virtual: 'Διαδικτυακό',
  hybrid: 'Υβριδικό',
}

export default function AdminEventsPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const { data: events, isLoading } = useAdminEvents()
  const { mutate: deleteEvent } = useAdminDeleteEvent()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Διαχείριση Εκδηλώσεων</h1>
          <p className="mt-1 text-sm text-muted-foreground">Όλες οι εκδηλώσεις της πλατφόρμας</p>
        </div>
        <button
          onClick={() => router.push(`/${locale}/dashboard/events/new`)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Νέα Εκδήλωση
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Τίτλος</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Τύπος</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Κατάσταση</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Ημερομηνία
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">RSVP</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ενέργειες</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events && events.length > 0 ? (
                events.map((e) => (
                  <EventRow
                    key={e.id}
                    event={e}
                    locale={locale}
                    onEdit={() => router.push(`/${locale}/dashboard/events/${e.id}/edit`)}
                    onDelete={() => {
                      if (window.confirm('Να διαγραφεί αυτή η εκδήλωση;')) {
                        deleteEvent(e.id)
                      }
                    }}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Δεν υπάρχουν εκδηλώσεις
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

function EventRow({
  event,
  onEdit,
  onDelete,
}: {
  event: EventRow
  locale?: string
  onEdit: () => void
  onDelete: () => void
}) {
  const { mutate: updateEvent } = useAdminUpdateEvent(event.id)

  const toggleStatus = () => {
    const next = event.status === 'published' ? 'draft' : 'published'
    updateEvent({ status: next })
  }

  return (
    <tr className="hover:bg-muted/30">
      <td className="px-4 py-3">
        <p className="font-medium text-foreground">{event.title}</p>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {TYPE_LABELS[event.type] ?? event.type}
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[event.status] ?? ''}`}
        >
          {STATUS_LABELS[event.status] ?? event.status}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {new Date(event.start_date).toLocaleDateString('el-GR')}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{event.rsvp_count}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {event.status !== 'cancelled' && event.status !== 'completed' && (
            <button onClick={toggleStatus} className="text-xs text-blue-600 hover:underline">
              {event.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
          )}
          <button onClick={onEdit} className="text-xs text-foreground hover:underline">
            Επεξ.
          </button>
          <button onClick={onDelete} className="text-xs text-destructive hover:underline">
            Διαγ.
          </button>
        </div>
      </td>
    </tr>
  )
}
