'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type {
  ProfileRow,
  AnnouncementRow,
  AnnouncementInsert,
  AnnouncementUpdate,
  PollRow,
  PollOptionRow,
  PollInsert,
  PollOptionInsert,
  EventRow,
  EventUpdate,
  JobRow,
  JobUpdate,
  GalleryAlbumRow,
  GalleryPhotoRow,
  GroupRow,
} from '@/lib/supabase/types'

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
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('membership_status', 'active'),
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .in('role', ['verified_member', 'admin', 'super_admin']),
        supabase
          .from('businesses')
          .select('id', { count: 'exact', head: true })
          .eq('is_verified', false)
          .eq('is_active', true),
        supabase
          .from('success_stories')
          .select('id', { count: 'exact', head: true })
          .eq('is_approved', false),
        supabase
          .from('events')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'published'),
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
          month: new Date(month + '-01').toLocaleDateString('el-GR', {
            month: 'short',
            year: '2-digit',
          }),
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
      const { error } = await supabase.from('profiles').update(updates).in('id', userIds)
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
          owner_name: owner
            ? `${(owner as { first_name: string }).first_name} ${(owner as { last_name: string }).last_name}`
            : '—',
        })
      }

      for (const s of stories ?? []) {
        const author = Array.isArray(s.author) ? s.author[0] : s.author
        items.push({
          type: 'story',
          id: s.id,
          name: s.title,
          created_at: s.created_at,
          owner_name: author
            ? `${(author as { first_name: string }).first_name} ${(author as { last_name: string }).last_name}`
            : '—',
        })
      }

      return items.sort((a, b) => a.created_at.localeCompare(b.created_at))
    },
    staleTime: 15_000,
  })
}

// ── Admin update single profile ───────────────────────────────────────────────

export function useAdminUpdateProfile(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      updates: Partial<Omit<ProfileRow, 'id' | 'created_at' | 'updated_at' | 'search_vector'>>
    ) => {
      const supabase = createClient()
      const { error } = await supabase.from('profiles').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['profile', id] })
    },
  })
}

// ── Admin single user ─────────────────────────────────────────────────────────

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: async (): Promise<ProfileRow | null> => {
      const supabase = createClient()
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

// ── Admin Announcements ───────────────────────────────────────────────────────

export function useAdminAnnouncements() {
  return useQuery({
    queryKey: ['admin', 'announcements'],
    queryFn: async (): Promise<AnnouncementRow[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    staleTime: 15_000,
  })
}

export function useAdminUpdateAnnouncement(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updates: AnnouncementUpdate) => {
      const supabase = createClient()
      const { error } = await supabase.from('announcements').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

export function useAdminCreateAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: AnnouncementInsert) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('announcements')
        .insert({ ...values, created_by: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

export function useAdminDeleteAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}

// ── Admin Polls ───────────────────────────────────────────────────────────────

export type AdminPollWithOptions = PollRow & { poll_options: PollOptionRow[] }

export function useAdminPolls() {
  return useQuery({
    queryKey: ['admin', 'polls'],
    queryFn: async (): Promise<AdminPollWithOptions[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('polls')
        .select('*, poll_options(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []).map((p) => ({
        ...p,
        poll_options: (Array.isArray(p.poll_options) ? p.poll_options : []) as PollOptionRow[],
      }))
    },
    staleTime: 15_000,
  })
}

export function useAdminCreatePoll() {
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
      const {
        data: { user },
      } = await supabase.auth.getUser()
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'polls'] })
      queryClient.invalidateQueries({ queryKey: ['polls'] })
    },
  })
}

export function useAdminClosePoll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('polls').update({ is_active: false }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'polls'] })
      queryClient.invalidateQueries({ queryKey: ['polls'] })
    },
  })
}

export function useAdminDeletePoll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('polls').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'polls'] })
      queryClient.invalidateQueries({ queryKey: ['polls'] })
    },
  })
}

// ── Admin Success Stories ─────────────────────────────────────────────────────

export function useAdminSuccessStories() {
  return useQuery({
    queryKey: ['admin', 'success_stories'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('success_stories')
        .select('*, author:user_id(id, first_name, last_name)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []).map((s) => ({
        ...s,
        author: Array.isArray(s.author) ? s.author[0] : s.author,
      }))
    },
    staleTime: 15_000,
  })
}

// ── Admin Events ──────────────────────────────────────────────────────────────

export function useAdminEvents() {
  return useQuery({
    queryKey: ['admin', 'events'],
    queryFn: async (): Promise<EventRow[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    staleTime: 15_000,
  })
}

export function useAdminUpdateEvent(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updates: EventUpdate) => {
      const supabase = createClient()
      const { error } = await supabase.from('events').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useAdminDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// ── Admin Jobs ────────────────────────────────────────────────────────────────

export function useAdminJobs() {
  return useQuery({
    queryKey: ['admin', 'jobs'],
    queryFn: async (): Promise<JobRow[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    staleTime: 15_000,
  })
}

export function useAdminUpdateJob(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updates: JobUpdate) => {
      const supabase = createClient()
      const { error } = await supabase.from('jobs').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

export function useAdminDeleteJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('jobs').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

// ── Admin Gallery ─────────────────────────────────────────────────────────────

export function useAdminAlbums() {
  return useQuery({
    queryKey: ['admin', 'gallery_albums'],
    queryFn: async (): Promise<GalleryAlbumRow[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    staleTime: 15_000,
  })
}

export function useAdminPendingPhotos() {
  return useQuery({
    queryKey: ['admin', 'pending_photos'],
    queryFn: async (): Promise<(GalleryPhotoRow & { album_title?: string })[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*, album:album_id(title)')
        .eq('is_approved', false)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []).map((p) => {
        const album = Array.isArray(p.album) ? p.album[0] : p.album
        return {
          ...p,
          album_title: album ? (album as { title: string }).title : undefined,
        }
      })
    },
    staleTime: 15_000,
  })
}

export function useApprovePhoto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('gallery_photos')
        .update({ is_approved: true })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending_photos'] })
      queryClient.invalidateQueries({ queryKey: ['gallery_photos'] })
    },
  })
}

export function useRejectPhoto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('gallery_photos').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending_photos'] })
      queryClient.invalidateQueries({ queryKey: ['gallery_photos'] })
    },
  })
}

export function useAdminDeleteAlbum() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('gallery_albums').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery_albums'] })
      queryClient.invalidateQueries({ queryKey: ['gallery_albums'] })
    },
  })
}

// ── Admin Groups ──────────────────────────────────────────────────────────────

export function useAdminGroups() {
  return useQuery({
    queryKey: ['admin', 'groups'],
    queryFn: async (): Promise<GroupRow[]> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('member_count', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    staleTime: 15_000,
  })
}

export function useAdminDeleteGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('groups').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

// ── Admin Benefits ────────────────────────────────────────────────────────────

export function useAdminBenefits() {
  return useQuery({
    queryKey: ['admin', 'benefits'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('benefits')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
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
