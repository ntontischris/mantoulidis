'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { NotificationList } from './NotificationList'
import {
  useUnreadNotificationCount,
  useRealtimeNotifications,
} from '../hooks/useNotifications'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const unread = useUnreadNotificationCount()

  // Subscribe to realtime notifications
  useRealtimeNotifications()

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen((v) => !v)}
        aria-label="Ειδοποιήσεις"
      >
        <span className="text-xl">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold text-destructive-foreground">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-10 z-50 w-[calc(100vw-2rem)] max-w-80 rounded-xl border border-border bg-background shadow-lg overflow-hidden sm:w-80">
            <NotificationList />
          </div>
        </>
      )}
    </div>
  )
}
