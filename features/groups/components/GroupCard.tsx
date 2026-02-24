'use client'

import Link from 'next/link'
import { useJoinGroup } from '../hooks/useGroups'
import type { GroupWithMembership } from '../hooks/useGroups'

interface GroupCardProps {
  group: GroupWithMembership
  locale: string
}

export function GroupCard({ group, locale }: GroupCardProps) {
  const { mutate: toggleJoin, isPending } = useJoinGroup()
  const name = locale === 'en' && group.name_en ? group.name_en : group.name
  const description = locale === 'en' && group.description_en ? group.description_en : group.description

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      {/* Cover placeholder */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
        👥
      </div>

      <div className="space-y-1 flex-1">
        <Link
          href={`/${locale}/dashboard/groups/${group.id}`}
          className="font-semibold text-foreground hover:text-primary"
        >
          {name}
        </Link>
        {group.is_private && (
          <span className="ml-2 text-xs text-muted-foreground">🔒 Ιδιωτική</span>
        )}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">
          {group.member_count} {group.member_count === 1 ? 'μέλος' : 'μέλη'}
        </span>
        <button
          type="button"
          disabled={isPending}
          onClick={() => toggleJoin({ groupId: group.id, join: !group.is_member })}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
            group.is_member
              ? 'border border-border hover:bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          {group.is_member ? 'Αποχώρηση' : 'Συμμετοχή'}
        </button>
      </div>
    </div>
  )
}
