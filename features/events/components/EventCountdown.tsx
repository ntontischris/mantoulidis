'use client'

import { useEffect, useState } from 'react'

interface EventCountdownProps {
  startDate: string
}

function getTimeRemaining(startDate: string) {
  const diff = new Date(startDate).getTime() - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  return { days, hours }
}

export function EventCountdown({ startDate }: EventCountdownProps) {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(startDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getTimeRemaining(startDate))
    }, 60_000)
    return () => clearInterval(interval)
  }, [startDate])

  if (!remaining) return null

  if (remaining.days === 0 && remaining.hours === 0) {
    return <span className="text-xs font-medium text-primary">Ξεκινάει σύντομα</span>
  }

  if (remaining.days === 0) {
    return (
      <span className="text-xs font-medium text-primary">
        Σε {remaining.hours} ώρ{remaining.hours === 1 ? 'α' : 'ες'}
      </span>
    )
  }

  return (
    <span className="text-xs font-medium text-muted-foreground">
      Σε {remaining.days} μέρ{remaining.days === 1 ? 'α' : 'ες'}
    </span>
  )
}
