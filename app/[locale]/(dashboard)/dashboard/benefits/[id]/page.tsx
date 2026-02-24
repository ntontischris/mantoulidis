'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useBenefit, useMyRedemption } from '@/features/benefits/hooks/useBenefits'
import { BenefitRedeemModal } from '@/features/benefits/components/BenefitRedeemModal'
import { BenefitCountdown } from '@/features/benefits/components/BenefitCountdown'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { BENEFIT_CATEGORIES } from '@/features/benefits/types'

export default function BenefitDetailPage() {
  const { id } = useParams<{ locale: string; id: string }>()
  const { profile } = useAuth()
  const { data: benefit, isLoading } = useBenefit(id)
  const { data: myRedemption } = useMyRedemption(id)
  const [modalOpen, setModalOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (!benefit) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Η παροχή δεν βρέθηκε.
      </div>
    )
  }

  const canRedeem =
    !benefit.requires_verified_member ||
    profile?.role === 'verified_member' ||
    profile?.role === 'admin' ||
    profile?.role === 'super_admin'

  const isExpired = benefit.valid_until
    ? new Date(benefit.valid_until) < new Date()
    : false

  const isFullyRedeemed =
    benefit.max_redemptions !== null &&
    benefit.redemption_count >= benefit.max_redemptions

  const categoryLabel =
    BENEFIT_CATEGORIES.find((c) => c.value === benefit.category)?.label ?? benefit.category

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-muted overflow-hidden">
          {benefit.partner_logo_url ? (
            <Image
              src={benefit.partner_logo_url}
              alt={benefit.partner_name}
              width={96}
              height={96}
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary">
              {benefit.partner_name[0]}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-sm text-muted-foreground">{benefit.partner_name}</p>
          <h1 className="text-2xl font-bold text-foreground">{benefit.title}</h1>
          {benefit.discount_text && (
            <p className="text-xl font-bold text-primary">{benefit.discount_text}</p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="secondary">{categoryLabel}</Badge>
            {benefit.valid_until && !isExpired && (
              <BenefitCountdown validUntil={benefit.valid_until} />
            )}
            {isExpired && <Badge variant="destructive">Έχει λήξει</Badge>}
          </div>
        </div>
      </div>

      <Separator />

      {/* Description */}
      {benefit.description && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Περιγραφή
          </h2>
          <p className="text-sm text-foreground whitespace-pre-wrap">{benefit.description}</p>
        </div>
      )}

      {/* Terms */}
      {benefit.terms && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Όροι & Προϋποθέσεις
          </h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{benefit.terms}</p>
        </div>
      )}

      {/* Stats */}
      {benefit.max_redemptions !== null && (
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">
            Εξαργυρώσεις:{' '}
            <span className="font-semibold text-foreground">
              {benefit.redemption_count} / {benefit.max_redemptions}
            </span>
          </p>
        </div>
      )}

      {/* Redeem CTA */}
      <div className="flex flex-col gap-3">
        {myRedemption ? (
          <Button onClick={() => setModalOpen(true)} variant="outline" className="w-full">
            Εμφάνιση QR κώδικα
          </Button>
        ) : !canRedeem ? (
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground text-center">
            Μόνο επαληθευμένα μέλη μπορούν να εξαργυρώσουν αυτή την παροχή.
          </div>
        ) : isExpired ? (
          <Button disabled className="w-full">
            Έχει λήξει
          </Button>
        ) : isFullyRedeemed ? (
          <Button disabled className="w-full">
            Εξαντλήθηκε
          </Button>
        ) : (
          <Button onClick={() => setModalOpen(true)} className="w-full">
            Εξαργύρωση παροχής
          </Button>
        )}

        {benefit.redemption_url && (
          <Button variant="outline" asChild className="w-full">
            <a href={benefit.redemption_url} target="_blank" rel="noopener noreferrer">
              Επίσκεψη ιστοσελίδας συνεργάτη
            </a>
          </Button>
        )}
      </div>

      {/* Redeem modal */}
      {modalOpen && (
        <BenefitRedeemModal
          benefit={benefit}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
