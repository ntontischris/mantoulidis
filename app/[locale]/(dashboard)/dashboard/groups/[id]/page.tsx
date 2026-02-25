'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useGroup, useJoinGroup } from '@/features/groups/hooks/useGroups'
import { GroupFeed } from '@/features/groups/components/GroupFeed'

export default function GroupDetailPage() {
  const { locale, id } = useParams<{ locale: string; id: string }>()
  const { data: group, isLoading } = useGroup(id)
  const { mutate: toggleJoin, isPending } = useJoinGroup()

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 lg:p-6">
        <div className="h-8 w-1/2 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
        <p className="text-4xl">👥</p>
        <p>Η ομάδα δεν βρέθηκε</p>
        <Link href={`/${locale}/dashboard/groups`} className="text-sm text-primary hover:underline">
          ← Πίσω στις ομάδες
        </Link>
      </div>
    )
  }

  const name = locale === 'en' && group.name_en ? group.name_en : group.name
  const description = locale === 'en' && group.description_en ? group.description_en : group.description

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <Link href={`/${locale}/dashboard/groups`} className="text-sm text-muted-foreground hover:text-foreground">
        ← Πίσω στις ομάδες
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{name}</h1>
              {group.is_private && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  🔒 Ιδιωτική
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {group.member_count} {group.member_count === 1 ? 'μέλος' : 'μέλη'}
            </p>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() => toggleJoin({ groupId: group.id, join: !group.is_member })}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
              group.is_member
                ? 'border border-border hover:bg-muted text-muted-foreground'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            {group.is_member ? 'Αποχώρηση' : 'Συμμετοχή'}
          </button>
        </div>
      </div>

      {/* Feed */}
      {group.is_member || !group.is_private ? (
        <GroupFeed groupId={group.id} isMember={group.is_member} />
      ) : (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          🔒 Αυτή είναι ιδιωτική ομάδα. Γίνετε μέλος για να δείτε τις αναρτήσεις.
        </div>
      )}
    </div>
  )
}
