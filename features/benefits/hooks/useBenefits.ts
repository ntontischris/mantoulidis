'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { BenefitFilters } from '../types'
import type { BenefitInsert, BenefitUpdate } from '@/lib/supabase/types'

// ── List ──────────────────────────────────────────────────────────────────────

export function useBenefits(filters: BenefitFilters = {}) {
  return useQuery({
    queryKey: ['benefits', filters],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('benefits')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.activeOnly !== false) {
        query = query.eq('is_active', true)
      }

      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,partner_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

// ── Single ────────────────────────────────────────────────────────────────────

export function useBenefit(id: string) {
  return useQuery({
    queryKey: ['benefits', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('benefits')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

// ── Check if current user already redeemed a benefit ──────────────────────────

export function useMyRedemption(benefitId: string) {
  return useQuery({
    queryKey: ['benefit_redemptions', 'me', benefitId],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      const { data } = await supabase
        .from('benefit_redemptions')
        .select('*')
        .eq('benefit_id', benefitId)
        .eq('user_id', user.id)
        .maybeSingle()
      return data ?? null
    },
    enabled: !!benefitId,
  })
}

// ── Redeem ────────────────────────────────────────────────────────────────────

export function useRedeemBenefit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (benefitId: string) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('benefit_redemptions')
        .insert({ benefit_id: benefitId, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, benefitId) => {
      queryClient.invalidateQueries({ queryKey: ['benefit_redemptions', 'me', benefitId] })
      queryClient.invalidateQueries({ queryKey: ['benefits', benefitId] })
      queryClient.invalidateQueries({ queryKey: ['benefits'] })
    },
  })
}

// ── Admin CRUD ────────────────────────────────────────────────────────────────

export function useCreateBenefit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: BenefitInsert) => {
      const supabase = createClient()
      const { data: created, error } = await supabase
        .from('benefits')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return created
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['benefits'] })
    },
  })
}

export function useUpdateBenefit(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: BenefitUpdate) => {
      const supabase = createClient()
      const { data: updated, error } = await supabase
        .from('benefits')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['benefits'] })
      queryClient.invalidateQueries({ queryKey: ['benefits', id] })
    },
  })
}

export function useDeleteBenefit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('benefits').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['benefits'] })
    },
  })
}
