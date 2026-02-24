import type { MessageRow } from '@/lib/supabase/types'

interface MessageBubbleProps {
  message: MessageRow
  isOwn: boolean
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  if (message.is_deleted) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <p className="text-xs text-muted-foreground italic px-3 py-1">
          Το μήνυμα διαγράφηκε
        </p>
      </div>
    )
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted text-foreground rounded-bl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground'
          } text-right`}
        >
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  )
}
