import type { ConversationRow, MessageRow, ProfileRow } from '@/lib/supabase/types'

export type Conversation = ConversationRow
export type Message = MessageRow

export type ConversationWithParticipants = ConversationRow & {
  participants: Pick<ProfileRow, 'id' | 'first_name' | 'last_name' | 'avatar_url'>[]
  unread_count: number
}
