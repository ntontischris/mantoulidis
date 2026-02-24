'use client'

import { useState } from 'react'
import { useConversations } from '../hooks/useMessages'
import { ConversationItem } from './ConversationItem'
import { NewConversationModal } from './NewConversationModal'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface ConversationListProps {
  locale: string
  activeConversationId?: string
}

export function ConversationList({ locale, activeConversationId }: ConversationListProps) {
  const { data: conversations, isLoading } = useConversations()
  const [showNewModal, setShowNewModal] = useState(false)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border shrink-0">
        <h2 className="font-semibold text-foreground">Μηνύματα</h2>
        <Button size="sm" onClick={() => setShowNewModal(true)}>
          + Νέο
        </Button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2 space-y-0.5">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8 px-4">
            Δεν υπάρχουν συνομιλίες ακόμα.
          </p>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              locale={locale}
              isActive={conv.id === activeConversationId}
            />
          ))
        )}
      </div>

      {/* New conversation modal */}
      {showNewModal && (
        <NewConversationModal
          locale={locale}
          onClose={() => setShowNewModal(false)}
        />
      )}
    </div>
  )
}
