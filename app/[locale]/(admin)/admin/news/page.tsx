'use client'

import { useState } from 'react'
import {
  useAdminAnnouncements,
  useAdminCreateAnnouncement,
  useAdminUpdateAnnouncement,
  useAdminDeleteAnnouncement,
  useAdminPolls,
  useAdminCreatePoll,
  useAdminClosePoll,
  useAdminDeletePoll,
  useAdminSuccessStories,
  useModerationAction,
} from '@/features/admin/hooks/useAdmin'
import { AnnouncementForm } from '@/features/news/components/AnnouncementForm'
import { PollForm } from '@/features/news/components/PollForm'
import type { AnnouncementFormValues } from '@/features/news/components/AnnouncementForm'
import type { PollFormValues, PollOption } from '@/features/news/components/PollForm'
import type { AnnouncementRow } from '@/lib/supabase/types'

type Tab = 'announcements' | 'polls' | 'stories'

export default function AdminNewsPage() {
  const [tab, setTab] = useState<Tab>('announcements')
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const [showPollForm, setShowPollForm] = useState(false)

  const { data: announcements, isLoading: loadingAnnouncements } = useAdminAnnouncements()
  const { mutateAsync: createAnnouncement, isPending: creatingAnnouncement } =
    useAdminCreateAnnouncement()
  const { mutate: deleteAnnouncement } = useAdminDeleteAnnouncement()

  const { data: polls, isLoading: loadingPolls } = useAdminPolls()
  const { mutateAsync: createPoll, isPending: creatingPoll } = useAdminCreatePoll()
  const { mutate: closePoll } = useAdminClosePoll()
  const { mutate: deletePoll } = useAdminDeletePoll()

  const { data: stories, isLoading: loadingStories } = useAdminSuccessStories()
  const { mutate: storyAction } = useModerationAction()

  async function handleCreateAnnouncement(values: AnnouncementFormValues) {
    await createAnnouncement({
      title: values.title,
      title_en: values.title_en || null,
      body: values.body,
      body_en: values.body_en || null,
      type: values.type,
      cover_url: values.cover_url || null,
      is_published: values.is_published,
      published_at: values.is_published ? new Date().toISOString() : null,
      created_by: null,
    })
    setShowAnnouncementForm(false)
  }

  async function handleCreatePoll(values: PollFormValues, options: PollOption[]) {
    await createPoll({
      poll: {
        question: values.question,
        question_en: values.question_en || null,
        closes_at: values.closes_at ? new Date(values.closes_at).toISOString() : null,
        is_active: values.is_active,
      },
      options,
    })
    setPollModal(false)
  }

  const setPollModal = setShowPollForm

  const TABS: { id: Tab; label: string }[] = [
    { id: 'announcements', label: 'Ανακοινώσεις' },
    { id: 'polls', label: 'Δημοψηφίσματα' },
    { id: 'stories', label: 'Ιστορίες Επιτυχίας' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Διαχείριση Νέων</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ανακοινώσεις, δημοψηφίσματα και ιστορίες επιτυχίας
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Announcements ── */}
      {tab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAnnouncementForm(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              + Νέα Ανακοίνωση
            </button>
          </div>

          {loadingAnnouncements ? (
            <SkeletonRows />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[600px] text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Τίτλος
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Κατηγορία
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Κατάσταση
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Ημερομηνία
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Ενέργειες
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {announcements && announcements.length > 0 ? (
                    announcements.map((a) => (
                      <AnnouncementRow
                        key={a.id}
                        announcement={a}
                        onDelete={() => deleteAnnouncement(a.id)}
                      />
                    ))
                  ) : (
                    <EmptyRow colSpan={5} message="Δεν υπάρχουν ανακοινώσεις" />
                  )}
                </tbody>
              </table>
            </div>
          )}

          {showAnnouncementForm && (
            <AdminModal title="Νέα Ανακοίνωση" onClose={() => setShowAnnouncementForm(false)}>
              <AnnouncementForm
                onSubmit={handleCreateAnnouncement}
                isPending={creatingAnnouncement}
              />
            </AdminModal>
          )}
        </div>
      )}

      {/* ── Polls ── */}
      {tab === 'polls' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowPollForm(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              + Νέο Δημοψήφισμα
            </button>
          </div>

          {loadingPolls ? (
            <SkeletonRows />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[600px] text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Ερώτηση
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Επιλογές
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Κατάσταση
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Λήξη</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Ενέργειες
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {polls && polls.length > 0 ? (
                    polls.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/30">
                        <td className="max-w-xs truncate px-4 py-3 font-medium text-foreground">
                          {p.question}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{p.poll_options.length}</td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            active={p.is_active}
                            activeLabel="Ενεργό"
                            inactiveLabel="Κλειστό"
                          />
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {p.closes_at ? new Date(p.closes_at).toLocaleDateString('el-GR') : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {p.is_active && (
                              <button
                                onClick={() => closePoll(p.id)}
                                className="text-xs text-amber-600 hover:underline"
                              >
                                Κλείσιμο
                              </button>
                            )}
                            <button
                              onClick={() => deletePoll(p.id)}
                              className="text-xs text-destructive hover:underline"
                            >
                              Διαγραφή
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <EmptyRow colSpan={5} message="Δεν υπάρχουν δημοψηφίσματα" />
                  )}
                </tbody>
              </table>
            </div>
          )}

          {showPollForm && (
            <AdminModal title="Νέο Δημοψήφισμα" onClose={() => setShowPollForm(false)}>
              <PollForm onSubmit={handleCreatePoll} isPending={creatingPoll} />
            </AdminModal>
          )}
        </div>
      )}

      {/* ── Stories ── */}
      {tab === 'stories' && (
        <div className="space-y-6">
          {loadingStories ? (
            <SkeletonRows />
          ) : (
            <>
              <StoriesTable
                title="Εκκρεμείς Εγκρίσεις"
                stories={(stories ?? []).filter((s) => !s.is_approved)}
                showActions
                onApprove={(id) => storyAction({ type: 'story', id, approve: true })}
                onReject={(id) => storyAction({ type: 'story', id, approve: false })}
              />
              <StoriesTable
                title={`Εγκεκριμένες (${(stories ?? []).filter((s) => s.is_approved).length})`}
                stories={(stories ?? []).filter((s) => s.is_approved)}
                showActions={false}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function AnnouncementRow({
  announcement,
  onDelete,
}: {
  announcement: AnnouncementRow
  onDelete: () => void
}) {
  const { mutate: update } = useAdminUpdateAnnouncement(announcement.id)
  return (
    <tr className="hover:bg-muted/30">
      <td className="max-w-xs truncate px-4 py-3 font-medium text-foreground">
        {announcement.title}
      </td>
      <td className="px-4 py-3 text-xs capitalize text-muted-foreground">{announcement.type}</td>
      <td className="px-4 py-3">
        <StatusBadge
          active={announcement.is_published}
          activeLabel="Δημοσιευμένο"
          inactiveLabel="Draft"
        />
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {new Date(announcement.created_at).toLocaleDateString('el-GR')}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() =>
              update({
                is_published: !announcement.is_published,
                published_at: !announcement.is_published ? new Date().toISOString() : null,
              })
            }
            className="text-xs text-blue-600 hover:underline"
          >
            {announcement.is_published ? 'Unpublish' : 'Publish'}
          </button>
          <button onClick={onDelete} className="text-xs text-destructive hover:underline">
            Διαγραφή
          </button>
        </div>
      </td>
    </tr>
  )
}

function StoriesTable({
  title,
  stories,
  showActions,
  onApprove,
  onReject,
}: {
  title: string
  stories: Array<{ id: string; title: string; author: unknown; created_at: string }>
  showActions: boolean
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[500px] text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Τίτλος</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Συγγραφέας</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ημερομηνία</th>
              {showActions && (
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ενέργειες</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stories.length === 0 ? (
              <EmptyRow colSpan={showActions ? 4 : 3} message="Δεν υπάρχουν εγγραφές" />
            ) : (
              stories.map((s) => {
                const author = s.author as { first_name: string; last_name: string } | null
                return (
                  <tr key={s.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{s.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {author ? `${author.first_name} ${author.last_name}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString('el-GR')}
                    </td>
                    {showActions && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onApprove?.(s.id)}
                            className="text-xs text-green-600 hover:underline"
                          >
                            Έγκριση
                          </button>
                          <button
                            onClick={() => onReject?.(s.id)}
                            className="text-xs text-destructive hover:underline"
                          >
                            Απόρριψη
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean
  activeLabel: string
  inactiveLabel: string
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-muted text-muted-foreground'
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  )
}

function SkeletonRows() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  )
}

function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-8 text-center text-sm text-muted-foreground">
        {message}
      </td>
    </tr>
  )
}

function AdminModal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <div className="px-4 sm:px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
