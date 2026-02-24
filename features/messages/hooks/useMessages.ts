'use client'

import { useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { ConversationWithParticipants } from '../types'

const PAGE_SIZE = 30

// ── Conversations list ────────────────────────────────────────────────────────

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<ConversationWithParticipants[]> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      // My conversation IDs
      const { data: myRows } = await supabase
        .from('conversation_participants')
        .select('conversation_id, last_read_at')
        .eq('user_id', user.id)

      if (!myRows || myRows.length === 0) return []

      const convIds = myRows.map((r) => r.conversation_id)
      const readMap = Object.fromEntries(myRows.map((r) => [r.conversation_id, r.last_read_at]))

      // Fetch conversations
      const { data: convs } = await supabase
        .from('conversations')
        .select('*')
        .in('id', convIds)
        .order('last_message_at', { ascending: false })

      if (!convs) return []

      // Fetch all participants for these conversations
      const { data: allParticipants } = await supabase
        .from('conversation_participants')
        .select('conversation_id, user_id, profiles:user_id(id, first_name, last_name, avatar_url)')
        .in('conversation_id', convIds)

      // Fetch unread counts per conversation
      const unreadCounts = await Promise.all(
        convIds.map(async (convId) => {
          const lastRead = readMap[convId]
          const { count } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', convId)
            .neq('sender_id', user.id)
            .gt('created_at', lastRead)
          return { convId, count: count ?? 0 }
        })
      )
      const unreadMap = Object.fromEntries(unreadCounts.map((u) => [u.convId, u.count]))

      return convs.map((conv) => {
        const parts = (allParticipants ?? [])
          .filter((p) => p.conversation_id === conv.id && p.user_id !== user.id)
          .map((p) => {
            const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles
            return profile as { id: string; first_name: string; last_name: string; avatar_url: string | null }
          })
          .filter(Boolean)

        return {
          ...conv,
          participants: parts,
          unread_count: unreadMap[conv.id] ?? 0,
        }
      })
    },
    staleTime: 10_000,
  })
}

// ── Messages (paginated, oldest-first display) ────────────────────────────────

export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: async ({ pageParam = 0 }) => {
      const supabase = createClient()
      const from = pageParam * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error
      return (data ?? []).reverse()
      // Reverse so oldest-first within a page
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined
      return allPages.length
    },
    enabled: !!conversationId,
  })
}

// ── Realtime subscription for new messages ────────────────────────────────────

export function useRealtimeMessages(conversationId: string) {
  const queryClient = useQueryClient()
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  useEffect(() => {
    if (!conversationId) return

    const supabase = createClient()
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          // Invalidate to refetch messages and conversation list
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
          queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, queryClient])
}

// ── Send message ──────────────────────────────────────────────────────────────

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (content: string) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, sender_id: user.id, content })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

// ── Start a new conversation ──────────────────────────────────────────────────

export function useStartConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ participantIds, title }: { participantIds: string[]; title?: string }) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Check if 1-on-1 conversation already exists
      if (participantIds.length === 1) {
        const otherId = participantIds[0]!
        const { data: myConvs } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id)

        if (myConvs && myConvs.length > 0) {
          const myConvIds = myConvs.map((r) => r.conversation_id)
          const { data: existing } = await supabase
            .from('conversation_participants')
            .select('conversation_id')
            .eq('user_id', otherId)
            .in('conversation_id', myConvIds)
            .limit(1)
            .maybeSingle()
          if (existing) return existing.conversation_id
        }
      }

      // Create new conversation
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({ title: title ?? null })
        .select()
        .single()
      if (convError) throw convError

      // Add all participants (creator + others)
      const allIds = [user.id, ...participantIds]
      await supabase.from('conversation_participants').insert(
        allIds.map((uid) => ({ conversation_id: conv.id, user_id: uid }))
      )

      return conv.id as string
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

// ── Mark conversation as read ─────────────────────────────────────────────────

export function useMarkConversationRead(conversationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
