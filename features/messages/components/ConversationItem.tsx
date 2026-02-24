import Link from 'next/link'
import { Avatar } from '@/components/shared/Avatar'
import { Badge } from '@/components/ui/badge'
import type { ConversationWithParticipants } from '../types'

interface ConversationItemProps {
  conversation: ConversationWithParticipants
  locale: string
  isActive?: boolean
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return d.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Χθες'
  if (diffDays < 7) return d.toLocaleDateString('el-GR', { weekday: 'short' })
  return d.toLocaleDateString('el-GR', { day: 'numeric', month: 'short' })
}

export function ConversationItem({ conversation, locale, isActive }: ConversationItemProps) {
  const other = conversation.participants[0]
  const displayName = conversation.title
    ?? (other ? `${other.first_name} ${other.last_name}` : 'Συνομιλία')

  return (
    <Link
      href={`/${locale}/dashboard/messages/${conversation.id}`}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-muted text-foreground'
      }`}
    >
      <Avatar
        src={other?.avatar_url ?? null}
        name={displayName}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="font-medium truncate text-sm">{displayName}</p>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatTime(conversation.last_message_at)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {conversation.last_message_preview ?? 'Νέα συνομιλία'}
        </p>
      </div>
      {conversation.unread_count > 0 && (
        <Badge className="shrink-0 h-5 min-w-5 text-xs px-1.5">
          {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
        </Badge>
      )}
    </Link>
  )
}
