'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Tables, BusinessInsert, BusinessUpdate } from '@/lib/supabase/types'

export type Business = Tables<'businesses'>

interface BusinessFilters {
  category?: string
  industry?: string
  city?: string
  is_verified?: boolean
}

export function useBusinesses(filters: BusinessFilters = {}) {
  return useQuery({
    queryKey: ['businesses', filters],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('businesses')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (filters.category) query = query.eq('category', filters.category)
      if (filters.industry) query = query.eq('industry', filters.industry)
      if (filters.city) query = query.eq('city', filters.city)
      if (filters.is_verified !== undefined) query = query.eq('is_verified', filters.is_verified)

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    staleTime: 60_000,
  })
}

export function useBusiness(id: string) {
  return useQuery({
    queryKey: ['business', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
    staleTime: 60_000,
  })
}

export function useCreateBusiness() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: BusinessInsert) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('businesses')
        .insert(input)
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['businesses'] })
    },
  })
}

export function useUpdateBusiness(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: BusinessUpdate) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('businesses')
        .update(input)
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['businesses'] })
      void qc.invalidateQueries({ queryKey: ['business', id] })
    },
  })
}

export function useDeleteBusiness() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('businesses')
        .update({ is_active: false })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['businesses'] })
    },
  })
}
