'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useSignOut } from '@/features/auth/hooks/useSignOut'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert } from '@/components/ui/alert'

interface SettingsContentProps {
  locale: string
}

export function SettingsContent({ locale }: SettingsContentProps) {
  const { profile, setProfile } = useAuth()
  const { signOut, isPending: isSigningOut } = useSignOut(locale)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggleField = async (field: 'email_public' | 'phone_public', value: boolean) => {
    if (!profile) return
    setSaving(true)
    setSaved(false)
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .update({ [field]: value })
      .eq('id', profile.id)
      .select('*')
      .single()
    if (data) setProfile(data)
    setSaving(false)
    setSaved(true)
  }

  const toggleLanguage = async (lang: 'el' | 'en') => {
    if (!profile) return
    setSaving(true)
    setSaved(false)
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .update({ language_pref: lang })
      .eq('id', profile.id)
      .select('*')
      .single()
    if (data) setProfile(data)
    setSaving(false)
    setSaved(true)
  }

  if (!profile) return null

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader title="Ρυθμίσεις" subtitle="Διαχείριση λογαριασμού και προτιμήσεων" />

      {saved && (
        <Alert>
          <p className="text-sm">Οι ρυθμίσεις αποθηκεύτηκαν.</p>
        </Alert>
      )}

      {/* Privacy */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Απόρρητο
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium">Δημόσιο email</p>
              <p className="text-xs text-muted-foreground">
                Άλλοι χρήστες μπορούν να βλέπουν το email σας
              </p>
            </div>
            <input
              type="checkbox"
              checked={profile.email_public}
              onChange={(e) => toggleField('email_public', e.target.checked)}
              disabled={saving}
              className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium">Δημόσιο τηλέφωνο</p>
              <p className="text-xs text-muted-foreground">
                Άλλοι χρήστες μπορούν να βλέπουν το τηλέφωνό σας
              </p>
            </div>
            <input
              type="checkbox"
              checked={profile.phone_public}
              onChange={(e) => toggleField('phone_public', e.target.checked)}
              disabled={saving}
              className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Language */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Γλώσσα
        </h2>
        <div className="flex gap-3">
          {(['el', 'en'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => toggleLanguage(lang)}
              disabled={saving}
              className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                profile.language_pref === lang
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {lang === 'el' ? '🇬🇷 Ελληνικά' : '🇬🇧 English'}
            </button>
          ))}
        </div>
      </section>

      <Separator />

      {/* Account */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Λογαριασμός
        </h2>
        <Button variant="destructive" onClick={signOut} disabled={isSigningOut}>
          {isSigningOut ? 'Αποσύνδεση...' : 'Αποσύνδεση'}
        </Button>
      </section>
    </div>
  )
}
