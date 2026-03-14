'use client'

import { useJoinGroup } from '../hooks/useGroups'

interface JoinGroupButtonProps {
  groupId: string
  isMember: boolean
}

export function JoinGroupButton({ groupId, isMember }: JoinGroupButtonProps) {
  const { mutate: toggleJoin, isPending } = useJoinGroup()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => toggleJoin({ groupId, join: !isMember })}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
        isMember
          ? 'border border-border text-muted-foreground hover:bg-muted'
          : 'bg-primary text-primary-foreground hover:opacity-90'
      }`}
    >
      {isMember ? 'Αποχώρηση' : 'Συμμετοχή'}
    </button>
  )
}
