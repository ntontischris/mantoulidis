import Link from 'next/link'
import Image from 'next/image'
import type { Tables } from '@/lib/supabase/types'
import { Badge } from '@/components/ui/badge'

type Business = Tables<'businesses'>

interface BusinessCardProps {
  business: Business
  locale: string
}

export function BusinessCard({ business, locale }: BusinessCardProps) {
  return (
    <Link
      href={`/${locale}/dashboard/businesses/${business.id}`}
      className="flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-md"
    >
      {/* Logo area */}
      <div className="flex h-32 items-center justify-center bg-muted">
        {business.logo_url ? (
          <Image
            src={business.logo_url}
            alt={business.name}
            width={120}
            height={80}
            className="object-contain p-4"
          />
        ) : (
          <div className="text-4xl">🏢</div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-foreground line-clamp-1">{business.name}</p>
          {business.is_verified && (
            <Badge className="shrink-0 text-xs">Επαληθευμένο</Badge>
          )}
        </div>

        {business.category && (
          <p className="text-xs text-muted-foreground">{business.category}</p>
        )}

        {business.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {business.description}
          </p>
        )}

        {business.city && (
          <p className="text-xs text-muted-foreground mt-auto pt-1">
            📍 {business.city}
          </p>
        )}
      </div>
    </Link>
  )
}
