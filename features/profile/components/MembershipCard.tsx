'use client'

import { useRef } from 'react'
import type { Tables } from '@/lib/supabase/types'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/button'

type Profile = Tables<'profiles'>

interface MembershipCardProps {
  profile: Profile
  email: string
}

export function MembershipCard({ profile, email }: MembershipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const statusLabel: Record<string, string> = {
    active: 'Ενεργό',
    inactive: 'Ανενεργό',
    suspended: 'Ανασταλμένο',
  }

  const roleLabel: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    verified_member: 'Επαληθευμένο Μέλος',
    basic_member: 'Βασικό Μέλος',
  }

  return (
    <div className="space-y-4">
      {/* Card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary p-6 text-white shadow-xl print:shadow-none"
        style={{ maxWidth: 380 }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border-2 border-white" />
          <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full border-2 border-white" />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-sm font-bold">
              AC
            </div>
            <div className="text-right text-xs opacity-75">
              <p>Alumni Connect</p>
              <p>Κάρτα Μέλους</p>
            </div>
          </div>

          {/* Member info */}
          <div className="flex items-center gap-4">
            <Avatar
              src={profile.avatar_url}
              name={`${profile.first_name} ${profile.last_name}`}
              size="lg"
              className="border-2 border-white/40"
            />
            <div>
              <p className="text-lg font-bold">
                {profile.first_name} {profile.last_name}
              </p>
              {profile.current_position && (
                <p className="text-sm opacity-80">{profile.current_position}</p>
              )}
              {profile.current_company && (
                <p className="text-xs opacity-60">{profile.current_company}</p>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {profile.membership_number && (
              <div>
                <p className="opacity-60">Αρ. Μέλους</p>
                <p className="font-mono font-semibold">{profile.membership_number}</p>
              </div>
            )}
            {profile.graduation_year && (
              <div>
                <p className="opacity-60">Έτος αποφοίτησης</p>
                <p className="font-semibold">{profile.graduation_year}</p>
              </div>
            )}
            <div>
              <p className="opacity-60">Κατάσταση</p>
              <p className="font-semibold">{statusLabel[profile.membership_status] ?? profile.membership_status}</p>
            </div>
            <div>
              <p className="opacity-60">Ρόλος</p>
              <p className="font-semibold">{roleLabel[profile.role] ?? profile.role}</p>
            </div>
          </div>

          {/* QR placeholder — will be replaced with actual QR when qrcode library is added */}
          <div className="flex items-end justify-between">
            <div className="text-xs opacity-60">{email}</div>
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/20 text-xs text-white/60">
              QR
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          Εκτύπωση
        </Button>
      </div>
    </div>
  )
}
