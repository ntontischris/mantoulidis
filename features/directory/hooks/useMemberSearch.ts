'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'

type SearchResult = Pick<
  Tables<'profiles'>,
  'id' | 'first_name' | 'last_name' | 'first_name_en' | 'last_name_en' |
  'current_position' | 'current_company' | 'avatar_url' | 'industry' | 'role'
>

export function useMemberSearch(query: string, debounceMs = 300) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const search = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([])
      return
    }
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select(
          'id, first_name, last_name, first_name_en, last_name_en, current_position, current_company, avatar_url, industry, role',
        )
        .eq('onboarding_completed', true)
        .or(
          `first_name.ilike.%${term}%,last_name.ilike.%${term}%,first_name_en.ilike.%${term}%,last_name_en.ilike.%${term}%,current_position.ilike.%${term}%`,
        )
        .limit(10)

      setResults(data ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      void search(query)
    }, debounceMs)
    return () => clearTimeout(timer)
  }, [query, debounceMs, search])

  return { results, isLoading }
}
