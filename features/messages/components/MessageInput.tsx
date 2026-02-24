'use client'

import { useState, useRef } from 'react'
import { useSendMessage } from '../hooks/useMessages'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface MessageInputProps {
  conversationId: string
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { mutate: send, isPending } = useSendMessage(conversationId)

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || isPending) return
    send(trimmed, {
      onSuccess: () => {
        setText('')
        textareaRef.current?.focus()
      },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-border px-4 py-3 bg-background">
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Γράψε μήνυμα... (Enter για αποστολή)"
        rows={1}
        className="resize-none max-h-32 overflow-y-auto flex-1"
      />
      <Button
        onClick={handleSend}
        disabled={!text.trim() || isPending}
        size="sm"
        className="shrink-0"
      >
        {isPending ? '...' : '↑'}
      </Button>
    </div>
  )
}
