import Link from 'next/link'
import type { NotificationRow } from '@/lib/supabase/types'

interface NotificationItemProps {
  notification: NotificationRow
  onRead: (id: string) => void
}

const TYPE_ICONS: Record<string, string> = {
  message: '💬',
  event_reminder: '📅',
  benefit_expiry: '🎁',
  mentorship: '🤝',
  system: '🔔',
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  if (diffMins < 1) return 'Μόλις τώρα'
  if (diffMins < 60) return `${diffMins} λεπ. πριν`
  const diffH = Math.floor(diffMins / 60)
  if (diffH < 24) return `${diffH} ώρ. πριν`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `${diffD} μέρ. πριν`
  return d.toLocaleDateString('el-GR', { day: 'numeric', month: 'short' })
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const icon = TYPE_ICONS[notification.type] ?? '🔔'

  const content = (
    <div
      className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted cursor-pointer ${
        !notification.is_read ? 'bg-primary/5' : ''
      }`}
      onClick={() => !notification.is_read && onRead(notification.id)}
    >
      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${!notification.is_read ? 'font-semibold' : 'font-normal'} truncate`}>
            {notification.title}
          </p>
          <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
            {formatTime(notification.created_at)}
          </span>
        </div>
        {notification.body && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.body}</p>
        )}
      </div>
      {!notification.is_read && (
        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
      )}
    </div>
  )

  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>
  }
  return content
}
