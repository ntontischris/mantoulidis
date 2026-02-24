'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { JobInsert, JobUpdate } from '@/lib/supabase/types'
import type { Job, JobFilters } from '../types'

// ── Jobs list ─────────────────────────────────────────────────────────────────

export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async (): Promise<Job[]> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      let query = supabase
        .from('jobs')
        .select('*, poster:posted_by(id, first_name, last_name, avatar_url)')
        .order('created_at', { ascending: false })

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,title_en.ilike.%${filters.search}%`
        )
      }
      if (filters.type) query = query.eq('type', filters.type)
      if (filters.status) query = query.eq('status', filters.status)
      else query = query.eq('status', 'open')
      if (filters.industry) query = query.eq('industry', filters.industry)
      if (filters.is_remote !== undefined) query = query.eq('is_remote', filters.is_remote)

      const { data, error } = await query
      if (error) throw error

      if (!user || !data) return (data ?? []) as Job[]

      // Fetch saved job IDs for current user
      const { data: savedRows } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id)

      const savedSet = new Set((savedRows ?? []).map((r) => r.job_id))

      return data.map((job) => {
        const poster = Array.isArray(job.poster) ? job.poster[0] : job.poster
        return {
          ...job,
          poster: poster as Job['poster'],
          is_saved: savedSet.has(job.id),
        }
      })
    },
    staleTime: 30_000,
  })
}

// ── Single job ────────────────────────────────────────────────────────────────

export function useJob(jobId: string) {
  return useQuery({
    queryKey: ['jobs', jobId],
    queryFn: async (): Promise<Job | null> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from('jobs')
        .select('*, poster:posted_by(id, first_name, last_name, avatar_url)')
        .eq('id', jobId)
        .single()

      if (error) throw error
      if (!data) return null

      const poster = Array.isArray(data.poster) ? data.poster[0] : data.poster

      let is_saved = false
      if (user) {
        const { data: saved } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', user.id)
          .eq('job_id', jobId)
          .maybeSingle()
        is_saved = !!saved
      }

      return {
        ...data,
        poster: poster as Job['poster'],
        is_saved,
      }
    },
    enabled: !!jobId,
  })
}

// ── My posted jobs ────────────────────────────────────────────────────────────

export function useMyJobs() {
  return useQuery({
    queryKey: ['jobs', 'mine'],
    queryFn: async (): Promise<Job[]> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('posted_by', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data ?? []) as Job[]
    },
  })
}

// ── Saved jobs ────────────────────────────────────────────────────────────────

export function useSaveJob(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ save }: { save: boolean }) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (save) {
        const { error } = await supabase
          .from('saved_jobs')
          .insert({ user_id: user.id, job_id: jobId })
        if (error && error.code !== '23505') throw error // ignore duplicate
      } else {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

// ── Create job ────────────────────────────────────────────────────────────────

export function useCreateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: Omit<JobInsert, 'posted_by'>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('jobs')
        .insert({ ...values, posted_by: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

// ── Update job ────────────────────────────────────────────────────────────────

export function useUpdateJob(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: JobUpdate) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('jobs')
        .update(values)
        .eq('id', jobId)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

// ── Delete job ────────────────────────────────────────────────────────────────

export function useDeleteJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (jobId: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('jobs').delete().eq('id', jobId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}
