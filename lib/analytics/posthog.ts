'use client'

import posthog from 'posthog-js'

let initialized = false

export function initPostHog() {
  if (typeof window === 'undefined' || initialized) return

  const key = process.env['NEXT_PUBLIC_POSTHOG_KEY']
  if (!key) return

  posthog.init(key, {
    api_host: process.env['NEXT_PUBLIC_POSTHOG_HOST'] ?? 'https://eu.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
    disable_session_recording: process.env.NODE_ENV !== 'production',
  })

  initialized = true
}

export function identifyUser(userId: string, properties: Record<string, unknown>) {
  posthog.identify(userId, properties)
}

export function captureEvent(eventName: string, properties?: Record<string, unknown>) {
  posthog.capture(eventName, properties)
}

export function resetAnalytics() {
  posthog.reset()
}
