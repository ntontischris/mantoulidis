'use client'

import { useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { NotificationRow } from '@/lib/supabase/types'

// ── List ──────────────────────────────────────────────────────────────────────

export function useNotifications(limit = 30) {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<NotificationRow[]> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data ?? []
    },
    staleTime: 30_000,
  })
}

export function useUnreadNotificationCount() {
  const { data } = useNotifications()
  return data?.filter((n) => !n.is_read).length ?? 0
}

// ── Mark read ─────────────────────────────────────────────────────────────────

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

// ── Realtime subscription ─────────────────────────────────────────────────────

export function useRealtimeNotifications() {
  const queryClient = useQueryClient()
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  useEffect(() => {
    let userId: string | null = null

    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      userId = user.id

      const channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
          }
        )
        .subscribe()

      channelRef.current = channel
    })

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [queryClient])
}
