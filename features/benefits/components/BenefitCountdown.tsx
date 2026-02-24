'use client'

import { useEffect, useState } from 'react'

interface BenefitCountdownProps {
  validUntil: string
}

function getDaysRemaining(validUntil: string): number {
  const diff = new Date(validUntil).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function BenefitCountdown({ validUntil }: BenefitCountdownProps) {
  const [days, setDays] = useState(() => getDaysRemaining(validUntil))

  useEffect(() => {
    const interval = setInterval(() => {
      setDays(getDaysRemaining(validUntil))
    }, 60_000)
    return () => clearInterval(interval)
  }, [validUntil])

  if (days === 0) {
    return <span className="text-xs font-medium text-destructive">Λήγει σήμερα</span>
  }

  const colorClass =
    days <= 7
      ? 'text-warning'
      : days <= 30
        ? 'text-foreground'
        : 'text-muted-foreground'

  return (
    <span className={`text-xs font-medium ${colorClass}`}>
      {days === 1 ? 'Λήγει αύριο' : `Λήγει σε ${days} μέρες`}
    </span>
  )
}
