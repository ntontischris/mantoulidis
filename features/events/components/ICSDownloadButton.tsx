'use client'

import { Button } from '@/components/ui/button'
import { downloadICS } from '@/lib/utils/ics'
import type { Event } from '../types'

interface ICSDownloadButtonProps {
  event: Event
}

export function ICSDownloadButton({ event }: ICSDownloadButtonProps) {
  const handleDownload = () => {
    downloadICS({
      uid: event.id,
      title: event.title,
      description: event.description ?? undefined,
      location: event.location ?? undefined,
      url: event.virtual_url ?? event.location_url ?? undefined,
      startDate: event.start_date,
      endDate: event.end_date,
    })
  }

  return (
    <Button variant="outline" onClick={handleDownload}>
      📅 Αποθήκευση στο ημερολόγιο
    </Button>
  )
}
