import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { EventRSVPButton } from '@/features/events/components/EventRSVPButton'
import { AttendeeList } from '@/features/events/components/AttendeeList'
import { ICSDownloadButton } from '@/features/events/components/ICSDownloadButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar } from '@/components/shared/Avatar'
import { EVENT_TYPE_LABELS, EVENT_STATUS_LABELS } from '@/features/events/types'

interface EventDetailPageProps {
  params: Promise<{ locale: string; id: string }>
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'el' ? 'el-GR' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { locale, id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) notFound()

  // Fetch creator profile
  const { data: creator } = event.created_by
    ? await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, current_position')
        .eq('id', event.created_by)
        .single()
    : { data: null }

  const isOwner = user.id === event.created_by
  const isUpcoming = new Date(event.start_date) > new Date()

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Cover */}
      {event.cover_url && (
        <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-muted">
          <Image
            src={event.cover_url}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{EVENT_TYPE_LABELS[event.type]}</Badge>
          {event.status !== 'published' && (
            <Badge variant={event.status === 'cancelled' ? 'destructive' : 'secondary'}>
              {EVENT_STATUS_LABELS[event.status]}
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{event.title}</h1>
          {isOwner && (
            <Button asChild size="sm" variant="outline" className="shrink-0">
              <Link href={`/${locale}/dashboard/events/${id}/edit`}>Επεξεργασία</Link>
            </Button>
          )}
        </div>

        {/* Date/time */}
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>🗓 {formatDate(event.start_date, locale)} — {formatDate(event.end_date, locale)}</p>
          {event.location && (
            <p>
              📍{' '}
              {event.location_url ? (
                <a
                  href={event.location_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {event.location}
                </a>
              ) : (
                event.location
              )}
            </p>
          )}
          {(event.type === 'virtual' || event.type === 'hybrid') && event.virtual_url && (
            <p>
              🔗{' '}
              <a
                href={event.virtual_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Σύνδεσμος εκδήλωσης
              </a>
            </p>
          )}
        </div>

        {/* Capacity */}
        {event.capacity && (
          <p className="text-sm text-muted-foreground">
            👥 {event.rsvp_count} / {event.capacity} συμμετέχοντες
            {event.waitlist_count > 0 && ` • ${event.waitlist_count} σε αναμονή`}
          </p>
        )}

        {/* RSVP + ICS */}
        <div className="flex flex-wrap gap-3 pt-2">
          <EventRSVPButton event={event} />
          {isUpcoming && (
            <ICSDownloadButton event={event} />
          )}
        </div>
      </div>

      <Separator />

      {/* Description */}
      {event.description && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Σχετικά
          </h2>
          <p className="text-sm text-foreground whitespace-pre-wrap">{event.description}</p>
        </div>
      )}

      {/* Attendees */}
      {event.rsvp_count > 0 && (
        <>
          <Separator />
          <AttendeeList eventId={event.id} totalCount={event.rsvp_count} />
        </>
      )}

      {/* Organizer */}
      {creator && (
        <>
          <Separator />
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Διοργανωτής
            </h2>
            <Link
              href={`/${locale}/dashboard/directory/${creator.id}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors w-fit"
            >
              <Avatar
                src={creator.avatar_url}
                name={`${creator.first_name} ${creator.last_name}`}
                size="md"
              />
              <div>
                <p className="font-semibold">{creator.first_name} {creator.last_name}</p>
                {creator.current_position && (
                  <p className="text-sm text-muted-foreground">{creator.current_position}</p>
                )}
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
