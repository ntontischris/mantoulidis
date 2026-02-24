import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { BenefitCountdown } from './BenefitCountdown'
import type { Benefit } from '../types'
import { BENEFIT_CATEGORIES } from '../types'

interface BenefitCardProps {
  benefit: Benefit
  locale: string
}

export function BenefitCard({ benefit, locale }: BenefitCardProps) {
  const categoryLabel =
    BENEFIT_CATEGORIES.find((c) => c.value === benefit.category)?.label ?? benefit.category

  const isExpiringSoon =
    benefit.valid_until
      ? new Date(benefit.valid_until).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000
      : false

  return (
    <Link
      href={`/${locale}/dashboard/benefits/${benefit.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Partner logo / header */}
      <div className="flex h-28 items-center justify-center bg-muted px-6">
        {benefit.partner_logo_url ? (
          <Image
            src={benefit.partner_logo_url}
            alt={benefit.partner_name}
            width={120}
            height={60}
            className="object-contain max-h-16"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {benefit.partner_name[0]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">{benefit.partner_name}</span>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {categoryLabel}
          </Badge>
        </div>

        <p className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {benefit.title}
        </p>

        {benefit.discount_text && (
          <p className="text-sm font-bold text-primary">{benefit.discount_text}</p>
        )}

        {benefit.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{benefit.description}</p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          {benefit.valid_until ? (
            <BenefitCountdown validUntil={benefit.valid_until} />
          ) : (
            <span className="text-xs text-muted-foreground">Χωρίς λήξη</span>
          )}
          {isExpiringSoon && benefit.valid_until && (
            <Badge variant="destructive" className="text-xs">
              Σύντομα λήγει
            </Badge>
          )}
        </div>
      </div>
    </Link>
  )
}
