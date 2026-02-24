'use client'

import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '../hooks/useNotifications'
import { NotificationItem } from './NotificationItem'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export function NotificationList() {
  const { data: notifications, isLoading } = useNotifications()
  const { mutate: markRead } = useMarkNotificationRead()
  const { mutate: markAll, isPending: markingAll } = useMarkAllNotificationsRead()

  const hasUnread = notifications?.some((n) => !n.is_read)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <p className="font-semibold text-sm">Ειδοποιήσεις</p>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={() => markAll()}
            disabled={markingAll}
          >
            Όλες ως αναγνωσμένες
          </Button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <LoadingSpinner />
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6 px-4">
            Δεν υπάρχουν ειδοποιήσεις
          </p>
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={markRead} />
          ))
        )}
      </div>
    </div>
  )
}
