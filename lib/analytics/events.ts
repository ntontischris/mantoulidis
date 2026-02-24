import { captureEvent } from './posthog'

// Type-safe analytics event catalog — no magic strings scattered in the codebase
export const Analytics = {
  auth: {
    signIn: (method: 'email' | 'magic_link' | 'google') =>
      captureEvent('user_signed_in', { method }),
    signUp: (method: 'email' | 'google') =>
      captureEvent('user_signed_up', { method }),
    signOut: () => captureEvent('user_signed_out'),
    registered: () => captureEvent('user_registered'),
    onboardingCompleted: () => captureEvent('onboarding_completed'),
  },
  directory: {
    searched: (query: string, resultsCount: number) =>
      captureEvent('directory_searched', { query_length: query.length, results_count: resultsCount }),
    profileViewed: (viewedUserId: string) =>
      captureEvent('profile_viewed', { viewed_user_id: viewedUserId }),
  },
  events: {
    viewed: (eventId: string) => captureEvent('event_viewed', { event_id: eventId }),
    rsvpd: (eventId: string, status: string) =>
      captureEvent('event_rsvpd', { event_id: eventId, status }),
    calendarAdded: (eventId: string) =>
      captureEvent('event_calendar_added', { event_id: eventId }),
  },
  benefits: {
    viewed: (benefitId: string) => captureEvent('benefit_viewed', { benefit_id: benefitId }),
    redeemed: (benefitId: string) => captureEvent('benefit_redeemed', { benefit_id: benefitId }),
  },
  messaging: {
    conversationStarted: () => captureEvent('conversation_started'),
    messageSent: () => captureEvent('message_sent'),
  },
  jobs: {
    viewed: (jobId: string) => captureEvent('job_viewed', { job_id: jobId }),
    applied: (jobId: string) => captureEvent('job_applied', { job_id: jobId }),
  },
  mentorship: {
    requested: (mentorId: string) =>
      captureEvent('mentorship_requested', { mentor_id: mentorId }),
  },
}
