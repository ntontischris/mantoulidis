'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BenefitRedeemModal } from './BenefitRedeemModal'
import type { Benefit } from '../types'

interface BenefitRedeemSectionProps {
  benefit: Benefit
  hasRedemption: boolean
  canRedeem: boolean
  isExpired: boolean
  isFullyRedeemed: boolean
}

export function BenefitRedeemSection({
  benefit,
  hasRedemption,
  canRedeem,
  isExpired,
  isFullyRedeemed,
}: BenefitRedeemSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-3">
        {hasRedemption ? (
          <Button onClick={() => setModalOpen(true)} variant="outline" className="w-full">
            Εμφάνιση QR κώδικα
          </Button>
        ) : !canRedeem ? (
          <div className="bg-muted/40 rounded-xl border border-border p-4 text-center text-sm text-muted-foreground">
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

      {modalOpen && (
        <BenefitRedeemModal
          benefit={benefit}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
