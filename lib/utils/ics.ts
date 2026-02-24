/**
 * Generates an .ics (iCalendar) file content for a single event.
 * RFC 5545 compliant.
 */

interface ICSEvent {
  uid: string
  title: string
  description?: string
  location?: string
  url?: string
  startDate: string
  // ISO 8601
  endDate: string
  // ISO 8601
}

function toICSDate(isoDate: string): string {
  // Convert "2024-03-15T18:00:00.000Z" → "20240315T180000Z"
  return isoDate.replace(/[-:]/g, '').replace(/\.\d{3}/, '').replace('Z', 'Z')
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

export function generateICS(event: ICSEvent): string {
  const now = toICSDate(new Date().toISOString())
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Alumni Connect//Alumni Connect//EL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.uid}@alumni-connect`,
    `DTSTAMP:${now}`,
    `DTSTART:${toICSDate(event.startDate)}`,
    `DTEND:${toICSDate(event.endDate)}`,
    `SUMMARY:${escapeICS(event.title)}`,
  ]

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICS(event.description)}`)
  }
  if (event.location) {
    lines.push(`LOCATION:${escapeICS(event.location)}`)
  }
  if (event.url) {
    lines.push(`URL:${event.url}`)
  }

  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n')
}

export function downloadICS(event: ICSEvent, filename?: string): void {
  const content = generateICS(event)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename ?? `${event.title.replace(/\s+/g, '-').toLowerCase()}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
