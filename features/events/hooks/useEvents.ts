'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { EventFilters } from '../types'
import type { EventInsert, EventUpdate } from '@/lib/supabase/types'

// ── List ──────────────────────────────────────────────────────────────────────

export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: filters.upcoming !== false })

      // Default: show published events
      if (filters.status) {
        query = query.eq('status', filters.status)
      } else {
        query = query.in('status', ['published', 'completed'])
      }

      if (filters.type) {
        query = query.eq('type', filters.type)
      }

      if (filters.upcoming === true) {
        query = query.gte('start_date', new Date().toISOString())
      } else if (filters.upcoming === false) {
        query = query.lt('start_date', new Date().toISOString())
      }

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    staleTime: 30_000,
  })
}

// ── Single ────────────────────────────────────────────────────────────────────

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

// ── My RSVP for an event ──────────────────────────────────────────────────────

export function useMyRsvp(eventId: string) {
  return useQuery({
    queryKey: ['event_rsvps', 'me', eventId],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      const { data } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle()
      return data ?? null
    },
    enabled: !!eventId,
  })
}

// ── Event attendees (attending only, limited preview) ────────────────────────

export function useEventAttendees(eventId: string, limit = 10) {
  return useQuery({
    queryKey: ['event_rsvps', 'attendees', eventId],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('event_rsvps')
        .select('user_id, profiles:user_id(id, first_name, last_name, avatar_url)')
        .eq('event_id', eventId)
        .eq('status', 'attending')
        .order('created_at', { ascending: true })
        .limit(limit)
      if (error) throw error
      return data ?? []
    },
    enabled: !!eventId,
  })
}

// ── RSVP / cancel ────────────────────────────────────────────────────────────

export function useEventRSVP(eventId: string) {
  const queryClient = useQueryClient()

  const rsvp = useMutation({
    mutationFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('event_rsvps')
        .insert({ event_id: eventId, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event_rsvps', 'me', eventId] })
      queryClient.invalidateQueries({ queryKey: ['event_rsvps', 'attendees', eventId] })
      queryClient.invalidateQueries({ queryKey: ['events', eventId] })
    },
  })

  const cancel = useMutation({
    mutationFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('event_rsvps')
        .update({ status: 'cancelled' })
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event_rsvps', 'me', eventId] })
      queryClient.invalidateQueries({ queryKey: ['event_rsvps', 'attendees', eventId] })
      queryClient.invalidateQueries({ queryKey: ['events', eventId] })
    },
  })

  return { rsvp, cancel }
}

// ── Admin CRUD ────────────────────────────────────────────────────────────────

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: EventInsert) => {
      const supabase = createClient()
      const { data: created, error } = await supabase
        .from('events')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return created
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: EventUpdate) => {
      const supabase = createClient()
      const { data: updated, error } = await supabase
        .from('events')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', id] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
