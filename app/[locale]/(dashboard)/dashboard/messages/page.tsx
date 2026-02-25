'use client'

import { useParams } from 'next/navigation'
import { ConversationList } from '@/features/messages/components/ConversationList'

export default function MessagesPage() {
  const { locale } = useParams<{ locale: string }>()

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-none sm:rounded-2xl border-0 sm:border border-border bg-card">
      {/* Conversation list */}
      <div className="w-full border-r border-border sm:w-72 lg:w-80 shrink-0">
        <ConversationList locale={locale} />
      </div>

      {/* Empty state — no conversation selected */}
      <div className="hidden sm:flex flex-1 items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <p className="text-4xl">💬</p>
          <p className="text-sm">Επιλέξτε μια συνομιλία</p>
        </div>
      </div>
    </div>
  )
}
