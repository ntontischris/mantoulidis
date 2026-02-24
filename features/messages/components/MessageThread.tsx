'use client'

import { useEffect, useRef } from 'react'
import { useMessages, useRealtimeMessages, useMarkConversationRead } from '../hooks/useMessages'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { MessageBubble } from './MessageBubble'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'

interface MessageThreadProps {
  conversationId: string
}

export function MessageThread({ conversationId }: MessageThreadProps) {
  const { user } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)
  const { data, isLoading, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage } =
    useMessages(conversationId)
  const { mutate: markRead } = useMarkConversationRead(conversationId)

  // Real-time subscription
  useRealtimeMessages(conversationId)

  // Mark as read on mount
  useEffect(() => {
    markRead()
  }, [conversationId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data?.pages])

  const allMessages = data?.pages.flat() ?? []

  if (isLoading) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4 space-y-2">
      {/* Load older messages */}
      {hasPreviousPage && (
        <div className="flex justify-center py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchPreviousPage()}
            disabled={isFetchingPreviousPage}
          >
            {isFetchingPreviousPage ? 'Φόρτωση...' : 'Παλαιότερα μηνύματα'}
          </Button>
        </div>
      )}

      {allMessages.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Κανένα μήνυμα ακόμα. Γράψε το πρώτο!
        </p>
      ) : (
        allMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender_id === user?.id}
          />
        ))
      )}

      <div ref={bottomRef} />
    </div>
  )
}
