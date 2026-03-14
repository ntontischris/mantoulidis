import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ConversationList } from '@/features/messages/components/ConversationList'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function MessagesPage({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-border bg-card">
      {/* Conversation list */}
      <div className="w-full shrink-0 border-r border-border sm:w-72 lg:w-80">
        <ConversationList locale={locale} />
      </div>

      {/* Empty state — no conversation selected */}
      <div className="hidden flex-1 items-center justify-center text-muted-foreground sm:flex">
        <div className="space-y-2 text-center">
          <p className="text-4xl">💬</p>
          <p className="text-sm">Επιλέξτε μια συνομιλία</p>
        </div>
      </div>
    </div>
  )
}
