'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { DirectoryFilters } from '../types'
import { DIRECTORY_PAGE_SIZE } from '../types'
import type { Tables } from '@/lib/supabase/types'

export type DirectoryMember = Tables<'profiles'>

export function useDirectory(filters: DirectoryFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['directory', filters],
    queryFn: async ({ pageParam = 0 }) => {
      const supabase = createClient()
      const from = pageParam * DIRECTORY_PAGE_SIZE
      const to = from + DIRECTORY_PAGE_SIZE - 1

      let query = supabase
        .from('profiles')
        .select('*')
        .eq('onboarding_completed', true)
        .range(from, to)
        .order('first_name', { ascending: true })

      // Full-text / trigram search
      if (filters.search && filters.search.trim()) {
        const term = filters.search.trim()
        query = query.or(
          `first_name.ilike.%${term}%,last_name.ilike.%${term}%,first_name_en.ilike.%${term}%,last_name_en.ilike.%${term}%,current_position.ilike.%${term}%,current_company.ilike.%${term}%`,
        )
      }

      if (filters.industry) {
        query = query.eq('industry', filters.industry)
      }

      if (filters.graduation_year) {
        query = query.eq('graduation_year', filters.graduation_year)
      }

      if (filters.is_mentor !== undefined) {
        query = query.eq('is_mentor', filters.is_mentor)
      }

      if (filters.role) {
        query = query.eq('role', filters.role)
      }

      if (filters.membership_status) {
        query = query.eq('membership_status', filters.membership_status)
      }

      const { data, error } = await query

      if (error) throw error
      return data ?? []
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < DIRECTORY_PAGE_SIZE) return undefined
      return allPages.length
    },
    staleTime: 60_000,
  })
}
