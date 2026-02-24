'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { ProfileRow } from '@/lib/supabase/types'

// ── Platform stats ────────────────────────────────────────────────────────────

export type PlatformStats = {
  totalMembers: number
  activeMembers: number
  verifiedMembers: number
  pendingModeration: number
  totalEvents: number
  totalJobs: number
  totalGroups: number
  totalMessages: number
}

export function usePlatformStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<PlatformStats> => {
      const supabase = createClient()

      const [
        { count: totalMembers },
        { count: activeMembers },
        { count: verifiedMembers },
        { count: pendingBusinesses },
        { count: pendingStories },
        { count: totalEvents },
        { count: totalJobs },
        { count: totalGroups },
        { count: totalMessages },
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('membership_status', 'active'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).in('role', ['verified_member', 'admin', 'super_admin']),
        supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('is_verified', false).eq('is_active', true),
        supabase.from('success_stories').select('id', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('groups').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
      ])

      return {
        totalMembers: totalMembers ?? 0,
        activeMembers: activeMembers ?? 0,
        verifiedMembers: verifiedMembers ?? 0,
        pendingModeration: (pendingBusinesses ?? 0) + (pendingStories ?? 0),
        totalEvents: totalEvents ?? 0,
        totalJobs: totalJobs ?? 0,
        totalGroups: totalGroups ?? 0,
        totalMessages: totalMessages ?? 0,
      }
    },
    staleTime: 30_000,
  })
}

// ── Member growth (last 12 months) ────────────────────────────────────────────

export type MonthlyGrowth = { month: string; count: number }

export function useMemberGrowth() {
  return useQuery({
    queryKey: ['admin', 'member_growth'],
    queryFn: async (): Promise<MonthlyGrowth[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at')
      if (error) throw error

      // Group by month
      const counts: Record<string, number> = {}
      for (const row of data ?? []) {
        const month = row.created_at.slice(0, 7) // YYYY-MM
        counts[month] = (counts[month] ?? 0) + 1
      }

      return Object.entries(counts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({
          month: new Date(month + '-01').toLocaleDateString('el-GR', { month: 'short', year: '2-digit' }),
          count,
        }))
    },
    staleTime: 60_000,
  })
}

// ── Users list ────────────────────────────────────────────────────────────────

export function useAdminUsers(search = '') {
  return useQuery({
    queryKey: ['admin', 'users', search],
    queryFn: async (): Promise<ProfileRow[]> => {
      const supabase = createClient()
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (search) {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,membership_number.ilike.%${search}%`
        )
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    staleTime: 10_000,
  })
}

// ── Bulk user action ──────────────────────────────────────────────────────────

export function useBulkUpdateUsers() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      userIds,
      updates,
    }: {
      userIds: string[]
      updates: Partial<Pick<ProfileRow, 'role' | 'membership_status'>>
    }) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .in('id', userIds)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

// ── Moderation queue ──────────────────────────────────────────────────────────

export type ModerationItem =
  | { type: 'business'; id: string; name: string; created_at: string; owner_name: string }
  | { type: 'story'; id: string; name: string; created_at: string; owner_name: string }

export function useModerationQueue() {
  return useQuery({
    queryKey: ['admin', 'moderation'],
    queryFn: async (): Promise<ModerationItem[]> => {
      const supabase = createClient()

      const [{ data: businesses }, { data: stories }] = await Promise.all([
        supabase
          .from('businesses')
          .select('id, name, created_at, owner:owner_id(first_name, last_name)')
          .eq('is_verified', false)
          .eq('is_active', true)
          .order('created_at'),
        supabase
          .from('success_stories')
          .select('id, title, created_at, author:user_id(first_name, last_name)')
          .eq('is_approved', false)
          .order('created_at'),
      ])

      const items: ModerationItem[] = []

      for (const b of businesses ?? []) {
        const owner = Array.isArray(b.owner) ? b.owner[0] : b.owner
        items.push({
          type: 'business',
          id: b.id,
          name: b.name,
          created_at: b.created_at,
          owner_name: owner ? `${(owner as { first_name: string }).first_name} ${(owner as { last_name: string }).last_name}` : '—',
        })
      }

      for (const s of stories ?? []) {
        const author = Array.isArray(s.author) ? s.author[0] : s.author
        items.push({
          type: 'story',
          id: s.id,
          name: s.title,
          created_at: s.created_at,
          owner_name: author ? `${(author as { first_name: string }).first_name} ${(author as { last_name: string }).last_name}` : '—',
        })
      }

      return items.sort((a, b) => a.created_at.localeCompare(b.created_at))
    },
    staleTime: 15_000,
  })
}

// ── Approve / Reject moderation item ─────────────────────────────────────────

export function useModerationAction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      type,
      id,
      approve,
    }: {
      type: 'business' | 'story'
      id: string
      approve: boolean
    }) => {
      const supabase = createClient()
      if (type === 'business') {
        if (approve) {
          await supabase.from('businesses').update({ is_verified: true }).eq('id', id)
        } else {
          await supabase.from('businesses').update({ is_active: false }).eq('id', id)
        }
      } else {
        if (approve) {
          await supabase.from('success_stories').update({ is_approved: true }).eq('id', id)
        } else {
          await supabase.from('success_stories').delete().eq('id', id)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}
