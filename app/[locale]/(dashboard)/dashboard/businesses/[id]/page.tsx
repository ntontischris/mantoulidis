import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Avatar } from '@/components/shared/Avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface BusinessDetailPageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  const { locale, id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!business) notFound()

  // Fetch owner profile
  const { data: owner } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, current_position')
    .eq('id', business.owner_id)
    .single()

  const isOwner = user.id === business.owner_id

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-muted text-4xl overflow-hidden">
          {business.logo_url ? (
            <Image
              src={business.logo_url}
              alt={business.name}
              width={96}
              height={96}
              className="object-contain p-2"
            />
          ) : (
            '🏢'
          )}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-start gap-3">
            <h1 className="text-2xl font-bold text-foreground">{business.name}</h1>
            {business.is_verified && <Badge>Επαληθευμένο</Badge>}
          </div>
          {business.category && (
            <p className="text-muted-foreground">{business.category}</p>
          )}
          {(business.city || business.country) && (
            <p className="text-sm text-muted-foreground">
              📍 {[business.city, business.country].filter(Boolean).join(', ')}
            </p>
          )}

          {isOwner && (
            <div className="pt-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/${locale}/dashboard/businesses/${id}/edit`}>Επεξεργασία</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Description */}
      {business.description && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Σχετικά
          </h2>
          <p className="text-sm text-foreground whitespace-pre-wrap">{business.description}</p>
        </div>
      )}

      {/* Contact */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {business.website_url && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Website</p>
            <a
              href={business.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-primary hover:underline truncate"
            >
              {business.website_url.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
        {business.email && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</p>
            <a href={`mailto:${business.email}`} className="mt-1 block text-primary hover:underline">
              {business.email}
            </a>
          </div>
        )}
        {business.phone && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Τηλέφωνο</p>
            <p className="mt-1">{business.phone}</p>
          </div>
        )}
        {business.industry && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Κλάδος</p>
            <p className="mt-1">{business.industry}</p>
          </div>
        )}
      </div>

      {/* Owner */}
      {owner && (
        <>
          <Separator />
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Ιδιοκτήτης
            </h2>
            <Link
              href={`/${locale}/dashboard/directory/${owner.id}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors w-fit"
            >
              <Avatar
                src={owner.avatar_url}
                name={`${owner.first_name} ${owner.last_name}`}
                size="md"
              />
              <div>
                <p className="font-semibold">{owner.first_name} {owner.last_name}</p>
                {owner.current_position && (
                  <p className="text-sm text-muted-foreground">{owner.current_position}</p>
                )}
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
