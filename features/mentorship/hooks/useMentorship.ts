'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { MentorshipInsert, MentorshipUpdate, MentorshipStatus } from '@/lib/supabase/types'
import type { Mentorship, MentorProfile, MentorFilters } from '../types'

// ── Mentors list (profiles with is_mentor = true) ─────────────────────────────

export function useMentors(filters: MentorFilters = {}) {
  return useQuery({
    queryKey: ['mentors', filters],
    queryFn: async (): Promise<MentorProfile[]> => {
      const supabase = createClient()

      let query = supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, current_position, current_company, industry, bio')
        .eq('is_mentor', true)
        .eq('membership_status', 'active')

      if (filters.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,current_position.ilike.%${filters.search}%,current_company.ilike.%${filters.search}%`
        )
      }
      if (filters.industry) {
        query = query.eq('industry', filters.industry)
      }

      const { data, error } = await query.order('first_name')
      if (error) throw error
      return (data ?? []) as MentorProfile[]
    },
    staleTime: 60_000,
  })
}

// ── My mentorships (as mentee) ────────────────────────────────────────────────

export function useMyMenteeMentorships() {
  return useQuery({
    queryKey: ['mentorships', 'as-mentee'],
    queryFn: async (): Promise<Mentorship[]> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('mentorships')
        .select('*, mentor:mentor_id(id, first_name, last_name, avatar_url, current_position, current_company, industry, bio)')
        .eq('mentee_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data ?? []).map((row) => ({
        ...row,
        mentor: (Array.isArray(row.mentor) ? row.mentor[0] : row.mentor) as MentorProfile | null,
      }))
    },
  })
}

// ── My mentorships (as mentor) ────────────────────────────────────────────────

export function useMyMentorMentorships() {
  return useQuery({
    queryKey: ['mentorships', 'as-mentor'],
    queryFn: async (): Promise<Mentorship[]> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('mentorships')
        .select('*, mentee:mentee_id(id, first_name, last_name, avatar_url, current_position, current_company, industry, bio)')
        .eq('mentor_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data ?? []).map((row) => ({
        ...row,
        mentee: (Array.isArray(row.mentee) ? row.mentee[0] : row.mentee) as MentorProfile | null,
      }))
    },
  })
}

// ── Check existing mentorship with specific mentor ────────────────────────────

export function useExistingMentorship(mentorId: string) {
  return useQuery({
    queryKey: ['mentorships', 'with', mentorId],
    queryFn: async (): Promise<Mentorship | null> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data } = await supabase
        .from('mentorships')
        .select('*')
        .eq('mentor_id', mentorId)
        .eq('mentee_id', user.id)
        .maybeSingle()

      return data as Mentorship | null
    },
    enabled: !!mentorId,
  })
}

// ── Request mentorship ────────────────────────────────────────────────────────

export function useMentorshipRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ mentorId, goals, message }: { mentorId: string; goals?: string; message?: string }) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('mentorships')
        .insert({
          mentor_id: mentorId,
          mentee_id: user.id,
          goals: goals ?? null,
          message: message ?? null,
        })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorships'] })
    },
  })
}

// ── Update mentorship status ──────────────────────────────────────────────────

export function useUpdateMentorshipStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      mentorshipId,
      status,
      feedback,
    }: {
      mentorshipId: string
      status: MentorshipStatus
      feedback?: string
      isMentor?: boolean
    }) => {
      const supabase = createClient()
      const update: MentorshipUpdate = { status }

      const { data, error } = await supabase
        .from('mentorships')
        .update(update)
        .eq('id', mentorshipId)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorships'] })
    },
  })
}

// ── Submit feedback ───────────────────────────────────────────────────────────

export function useSubmitMentorshipFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      mentorshipId,
      feedback,
      isMentor,
    }: {
      mentorshipId: string
      feedback: string
      isMentor: boolean
    }) => {
      const supabase = createClient()
      const field = isMentor ? 'mentor_feedback' : 'mentee_feedback'
      const { data, error } = await supabase
        .from('mentorships')
        .update({ [field]: feedback })
        .eq('id', mentorshipId)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorships'] })
    },
  })
}
