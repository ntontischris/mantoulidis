import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { EventCountdown } from './EventCountdown'
import { EVENT_TYPE_LABELS, EVENT_STATUS_LABELS } from '../types'
import type { Event } from '../types'

interface EventCardProps {
  event: Event
  locale: string
}

function formatEventDate(start: string, end: string): string {
  const s = new Date(start)
  const e = new Date(end)
  const dateStr = s.toLocaleDateString('el-GR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const startTime = s.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })
  const endTime = e.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })
  return `${dateStr} • ${startTime}–${endTime}`
}

export function EventCard({ event, locale }: EventCardProps) {
  const isUpcoming = new Date(event.start_date) > new Date()
  const isFull =
    event.capacity !== null && event.rsvp_count >= event.capacity

  return (
    <Link
      href={`/${locale}/dashboard/events/${event.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Cover image */}
      <div className="relative flex h-44 items-center justify-center bg-muted overflow-hidden">
        {event.cover_url ? (
          <Image
            src={event.cover_url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl select-none">📅</span>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge>{EVENT_TYPE_LABELS[event.type]}</Badge>
          {event.status === 'cancelled' && (
            <Badge variant="destructive">{EVENT_STATUS_LABELS.cancelled}</Badge>
          )}
          {event.status === 'completed' && (
            <Badge variant="secondary">{EVENT_STATUS_LABELS.completed}</Badge>
          )}
        </div>
        {isFull && isUpcoming && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary">Πλήρες</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-muted-foreground">
          {formatEventDate(event.start_date, event.end_date)}
        </p>

        <p className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </p>

        {event.location && (
          <p className="text-xs text-muted-foreground truncate">📍 {event.location}</p>
        )}

        {event.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {event.rsvp_count} {event.rsvp_count === 1 ? 'συμμετέχων' : 'συμμετέχοντες'}
            {event.capacity && ` / ${event.capacity}`}
          </span>
          {isUpcoming && event.status === 'published' && (
            <EventCountdown startDate={event.start_date} />
          )}
        </div>
      </div>
    </Link>
  )
}
