'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { BenefitQRCode } from './BenefitQRCode'
import { useRedeemBenefit, useMyRedemption } from '../hooks/useBenefits'
import type { Benefit } from '../types'

interface BenefitRedeemModalProps {
  benefit: Benefit
  open: boolean
  onClose: () => void
}

export function BenefitRedeemModal({ benefit, open, onClose }: BenefitRedeemModalProps) {
  const { data: existing, isLoading: checkingRedemption } = useMyRedemption(benefit.id)
  const { mutateAsync: redeem, isPending } = useRedeemBenefit()
  const [redemption, setRedemption] = useState(existing ?? null)

  const handleRedeem = async () => {
    const result = await redeem(benefit.id)
    setRedemption(result)
  }

  const activeRedemption = redemption ?? existing
  const qrValue = activeRedemption
    ? `ALUMNI:${benefit.id}:${activeRedemption.verification_code}`
    : benefit.redemption_code
      ? `CODE:${benefit.redemption_code}`
      : null

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{benefit.title}</DialogTitle>
          <DialogDescription>{benefit.partner_name}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          {checkingRedemption ? (
            <p className="text-sm text-muted-foreground">Έλεγχος...</p>
          ) : activeRedemption ? (
            <>
              <p className="text-sm text-center text-muted-foreground">
                Το όφελος σου έχει εξαργυρωθεί. Δείξε τον QR κώδικα στον συνεργάτη.
              </p>
              {qrValue && <BenefitQRCode value={qrValue} size={180} />}
              <div className="rounded-lg bg-muted px-4 py-2 text-center">
                <p className="text-xs text-muted-foreground">Κωδικός επαλήθευσης</p>
                <p className="font-mono font-bold tracking-widest">{activeRedemption.verification_code}</p>
              </div>
              {benefit.redemption_code && (
                <div className="rounded-lg border border-border px-4 py-2 text-center w-full">
                  <p className="text-xs text-muted-foreground">Κωδικός έκπτωσης</p>
                  <p className="font-mono font-bold text-primary">{benefit.redemption_code}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-center text-muted-foreground">
                {benefit.description ?? 'Εξαργύρωσε αυτό το όφελος για να αποκτήσεις πρόσβαση.'}
              </p>
              {benefit.discount_text && (
                <p className="text-2xl font-bold text-primary">{benefit.discount_text}</p>
              )}
              {benefit.terms && (
                <p className="text-xs text-muted-foreground text-center">{benefit.terms}</p>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          {!activeRedemption && !checkingRedemption && (
            <Button onClick={handleRedeem} disabled={isPending} className="w-full">
              {isPending ? 'Εξαργύρωση...' : 'Εξαργύρωση'}
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="w-full">
            Κλείσιμο
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
