import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ConversationList } from '@/features/messages/components/ConversationList'
import { MessageThread } from '@/features/messages/components/MessageThread'
import { MessageInput } from '@/features/messages/components/MessageInput'

interface PageProps {
  params: Promise<{ locale: string; conversationId: string }>
}

export default async function ConversationPage({ params }: PageProps) {
  const { locale, conversationId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-border bg-card">
      {/* Conversation list — hidden on mobile when in a conversation */}
      <div className="hidden w-72 shrink-0 border-r border-border sm:flex lg:w-80">
        <ConversationList locale={locale} activeConversationId={conversationId} />
      </div>

      {/* Active conversation */}
      <div className="flex min-w-0 flex-1 flex-col">
        <MessageThread conversationId={conversationId} />
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  )
}
