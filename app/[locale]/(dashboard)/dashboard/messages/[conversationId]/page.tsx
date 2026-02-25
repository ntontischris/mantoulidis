'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ConversationList } from '@/features/messages/components/ConversationList'
import { MessageThread } from '@/features/messages/components/MessageThread'
import { MessageInput } from '@/features/messages/components/MessageInput'

export default function ConversationPage() {
  const { locale, conversationId } = useParams<{ locale: string; conversationId: string }>()

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-none sm:rounded-2xl border-0 sm:border border-border bg-card">
      {/* Conversation list — hidden on mobile when in a conversation */}
      <div className="hidden sm:flex w-72 lg:w-80 shrink-0 border-r border-border">
        <ConversationList locale={locale} activeConversationId={conversationId} />
      </div>

      {/* Active conversation */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile back button */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2 sm:hidden">
          <Link
            href={`/${locale}/dashboard/messages`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <span className="text-sm font-medium text-foreground">Συνομιλία</span>
        </div>
        <MessageThread conversationId={conversationId} />
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  )
}
