import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { BenefitCountdown } from '@/features/benefits/components/BenefitCountdown'
import { BenefitRedeemSection } from '@/features/benefits/components/BenefitRedeemSection'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BENEFIT_CATEGORIES } from '@/features/benefits/types'

export default async function BenefitDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: benefit } = await supabase.from('benefits').select('*').eq('id', id).single()
  if (!benefit) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data: myRedemption } = await supabase
    .from('benefit_redemptions')
    .select('*')
    .eq('benefit_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  const canRedeem =
    !benefit.requires_verified_member ||
    profile?.role === 'verified_member' ||
    profile?.role === 'admin' ||
    profile?.role === 'super_admin'

  const isExpired = benefit.valid_until ? new Date(benefit.valid_until) < new Date() : false

  const isFullyRedeemed =
    benefit.max_redemptions !== null && benefit.redemption_count >= benefit.max_redemptions

  const categoryLabel =
    BENEFIT_CATEGORIES.find((c) => c.value === benefit.category)?.label ?? benefit.category

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted">
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
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Περιγραφή
          </h2>
          <p className="whitespace-pre-wrap text-sm text-foreground">{benefit.description}</p>
        </div>
      )}

      {/* Terms */}
      {benefit.terms && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Όροι & Προϋποθέσεις
          </h2>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{benefit.terms}</p>
        </div>
      )}

      {/* Stats */}
      {benefit.max_redemptions !== null && (
        <div className="bg-muted/40 rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">
            Εξαργυρώσεις:{' '}
            <span className="font-semibold text-foreground">
              {benefit.redemption_count} / {benefit.max_redemptions}
            </span>
          </p>
        </div>
      )}

      {/* Redeem CTA (client component) */}
      <BenefitRedeemSection
        benefit={benefit}
        hasRedemption={!!myRedemption}
        canRedeem={canRedeem}
        isExpired={isExpired}
        isFullyRedeemed={isFullyRedeemed}
      />
    </div>
  )
}
