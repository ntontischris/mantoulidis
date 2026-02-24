'use client'

import { useParams } from 'next/navigation'
import { ConversationList } from '@/features/messages/components/ConversationList'
import { MessageThread } from '@/features/messages/components/MessageThread'
import { MessageInput } from '@/features/messages/components/MessageInput'

export default function ConversationPage() {
  const { locale, conversationId } = useParams<{ locale: string; conversationId: string }>()

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-border bg-card">
      {/* Conversation list — hidden on mobile when in a conversation */}
      <div className="hidden sm:flex w-72 lg:w-80 shrink-0 border-r border-border">
        <ConversationList locale={locale} activeConversationId={conversationId} />
      </div>

      {/* Active conversation */}
      <div className="flex flex-1 flex-col min-w-0">
        <MessageThread conversationId={conversationId} />
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  )
}
