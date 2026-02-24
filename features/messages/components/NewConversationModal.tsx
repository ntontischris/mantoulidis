'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStartConversation } from '../hooks/useMessages'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import type { ProfileRow } from '@/lib/supabase/types'

interface NewConversationModalProps {
  locale: string
  onClose: () => void
}

export function NewConversationModal({ locale, onClose }: NewConversationModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Pick<ProfileRow, 'id' | 'first_name' | 'last_name' | 'avatar_url' | 'current_position'>[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const { mutateAsync: startConversation, isPending } = useStartConversation()

  const handleSearch = async (value: string) => {
    setQuery(value)
    if (value.trim().length < 2) { setResults([]); return }
    setSearching(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, current_position')
      .or(`first_name.ilike.%${value}%,last_name.ilike.%${value}%`)
      .eq('onboarding_completed', true)
      .limit(8)
    setResults(data ?? [])
    setSearching(false)
  }

  const handleStart = async () => {
    if (!selected) return
    const convId = await startConversation({ participantIds: [selected] })
    router.push(`/${locale}/dashboard/messages/${convId}`)
    onClose()
  }

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Νέα Συνομιλία</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Αναζήτηση μέλους..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          autoFocus
        />

        <div className="max-h-64 overflow-y-auto space-y-1">
          {searching && (
            <p className="text-sm text-muted-foreground text-center py-4">Αναζήτηση...</p>
          )}
          {!searching && results.length === 0 && query.length >= 2 && (
            <p className="text-sm text-muted-foreground text-center py-4">Δεν βρέθηκαν μέλη</p>
          )}
          {results.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelected(profile.id)}
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-left transition-colors ${
                selected === profile.id ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted'
              }`}
            >
              <Avatar
                src={profile.avatar_url}
                name={`${profile.first_name} ${profile.last_name}`}
                size="sm"
              />
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">
                  {profile.first_name} {profile.last_name}
                </p>
                {profile.current_position && (
                  <p className="text-xs text-muted-foreground truncate">{profile.current_position}</p>
                )}
              </div>
            </button>
          ))}
        </div>

        <Button onClick={handleStart} disabled={!selected || isPending} className="w-full">
          {isPending ? 'Δημιουργία...' : 'Έναρξη Συνομιλίας'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
