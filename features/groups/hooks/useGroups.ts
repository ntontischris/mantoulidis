'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { GroupRow, GroupInsert, GroupPostRow } from '@/lib/supabase/types'

export type GroupWithMembership = GroupRow & {
  is_member: boolean
  my_role: string | null
}

export type GroupPostWithAuthor = GroupPostRow & {
  author?: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string | null
  } | null
}

// ── Groups list ───────────────────────────────────────────────────────────────

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async (): Promise<GroupWithMembership[]> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data: groups, error } = await supabase
        .from('groups')
        .select('*')
        .order('member_count', { ascending: false })
      if (error) throw error
      if (!groups) return []

      if (!user) return groups.map((g) => ({ ...g, is_member: false, my_role: null }))

      const groupIds = groups.map((g) => g.id)
      const { data: memberships } = await supabase
        .from('group_members')
        .select('group_id, role')
        .eq('user_id', user.id)
        .in('group_id', groupIds)

      const memberMap = Object.fromEntries(
        (memberships ?? []).map((m) => [m.group_id, m.role])
      )

      return groups.map((g) => ({
        ...g,
        is_member: g.id in memberMap,
        my_role: memberMap[g.id] ?? null,
      }))
    },
    staleTime: 30_000,
  })
}

// ── Single group ──────────────────────────────────────────────────────────────

export function useGroup(groupId: string) {
  return useQuery({
    queryKey: ['groups', groupId],
    queryFn: async (): Promise<GroupWithMembership | null> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data: group, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single()
      if (error) throw error
      if (!group) return null

      let is_member = false
      let my_role: string | null = null
      if (user) {
        const { data: m } = await supabase
          .from('group_members')
          .select('role')
          .eq('group_id', groupId)
          .eq('user_id', user.id)
          .maybeSingle()
        if (m) { is_member = true; my_role = m.role }
      }

      return { ...group, is_member, my_role }
    },
    enabled: !!groupId,
  })
}

// ── Group posts ───────────────────────────────────────────────────────────────

export function useGroupPosts(groupId: string) {
  return useQuery({
    queryKey: ['group_posts', groupId],
    queryFn: async (): Promise<GroupPostWithAuthor[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('group_posts')
        .select('*, author:user_id(id, first_name, last_name, avatar_url)')
        .eq('group_id', groupId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return (data ?? []).map((row) => ({
        ...row,
        author: (Array.isArray(row.author) ? row.author[0] : row.author) as GroupPostWithAuthor['author'],
      }))
    },
    enabled: !!groupId,
    staleTime: 15_000,
  })
}

// ── Join / Leave group ────────────────────────────────────────────────────────

export function useJoinGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ groupId, join }: { groupId: string; join: boolean }) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (join) {
        const { error } = await supabase
          .from('group_members')
          .insert({ group_id: groupId, user_id: user.id, role: 'member' })
        if (error && error.code !== '23505') throw error
      } else {
        const { error } = await supabase
          .from('group_members')
          .delete()
          .eq('group_id', groupId)
          .eq('user_id', user.id)
        if (error) throw error
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  })
}

// ── Create group ──────────────────────────────────────────────────────────────

export function useCreateGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: Omit<GroupInsert, 'created_by'>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: group, error } = await supabase
        .from('groups')
        .insert({ ...values, created_by: user.id })
        .select()
        .single()
      if (error) throw error

      // Auto-join as admin
      await supabase
        .from('group_members')
        .insert({ group_id: group.id, user_id: user.id, role: 'admin' })

      return group
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  })
}

// ── Create group post ─────────────────────────────────────────────────────────

export function useCreateGroupPost(groupId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (content: string) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('group_posts')
        .insert({ group_id: groupId, user_id: user.id, content })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['group_posts', groupId] }),
  })
}

// ── Delete group post ─────────────────────────────────────────────────────────

export function useDeleteGroupPost(groupId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (postId: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('group_posts')
        .update({ is_deleted: true })
        .eq('id', postId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['group_posts', groupId] }),
  })
}
