'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type {
  AnnouncementRow, AnnouncementInsert,
  SuccessStoryRow, SuccessStoryInsert,
  PollRow, PollOptionRow, PollVoteRow, PollInsert, PollOptionInsert,
} from '@/lib/supabase/types'

// ── Announcements ─────────────────────────────────────────────────────────────

export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async (): Promise<AnnouncementRow[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    staleTime: 60_000,
  })
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: AnnouncementInsert) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('announcements')
        .insert({ ...values, created_by: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
  })
}

// ── Success Stories ───────────────────────────────────────────────────────────

export type SuccessStoryWithAuthor = SuccessStoryRow & {
  author?: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string | null
  } | null
}

export function useSuccessStories() {
  return useQuery({
    queryKey: ['success_stories'],
    queryFn: async (): Promise<SuccessStoryWithAuthor[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('success_stories')
        .select('*, author:user_id(id, first_name, last_name, avatar_url)')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []).map((row) => ({
        ...row,
        author: (Array.isArray(row.author) ? row.author[0] : row.author) as SuccessStoryWithAuthor['author'],
      }))
    },
    staleTime: 60_000,
  })
}

export function useCreateSuccessStory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: Omit<SuccessStoryInsert, 'user_id' | 'is_approved'>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('success_stories')
        .insert({ ...values, user_id: user.id, is_approved: false })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['success_stories'] }),
  })
}

// ── Polls ─────────────────────────────────────────────────────────────────────

export type PollWithOptions = PollRow & {
  options: PollOptionRow[]
  my_vote?: PollVoteRow | null
  total_votes: number
}

export function usePolls() {
  return useQuery({
    queryKey: ['polls'],
    queryFn: async (): Promise<PollWithOptions[]> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data: polls, error } = await supabase
        .from('polls')
        .select('*, poll_options(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      if (!polls) return []

      // Fetch user's votes
      const pollIds = polls.map((p) => p.id)
      let votesMap: Record<string, PollVoteRow> = {}
      if (user && pollIds.length > 0) {
        const { data: votes } = await supabase
          .from('poll_votes')
          .select('*')
          .eq('user_id', user.id)
          .in('poll_id', pollIds)
        votesMap = Object.fromEntries((votes ?? []).map((v) => [v.poll_id, v]))
      }

      return polls.map((poll) => {
        const options = (Array.isArray(poll.poll_options) ? poll.poll_options : []) as PollOptionRow[]
        const total_votes = options.reduce((sum, o) => sum + o.vote_count, 0)
        return {
          ...poll,
          options,
          my_vote: votesMap[poll.id] ?? null,
          total_votes,
        }
      })
    },
    staleTime: 30_000,
  })
}

export function usePollVote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ pollId, optionId }: { pollId: string; optionId: string }) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase
        .from('poll_votes')
        .insert({ poll_id: pollId, option_id: optionId, user_id: user.id })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['polls'] }),
  })
}

export function useCreatePoll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      poll,
      options,
    }: {
      poll: Omit<PollInsert, 'created_by'>
      options: Array<{ text: string; text_en?: string }>
    }) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: newPoll, error: pollError } = await supabase
        .from('polls')
        .insert({ ...poll, created_by: user.id })
        .select()
        .single()
      if (pollError) throw pollError

      const optionRows: PollOptionInsert[] = options.map((o, i) => ({
        poll_id: newPoll.id,
        text: o.text,
        text_en: o.text_en ?? null,
        position: i,
      }))
      const { error: optError } = await supabase.from('poll_options').insert(optionRows)
      if (optError) throw optError

      return newPoll
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['polls'] }),
  })
}
