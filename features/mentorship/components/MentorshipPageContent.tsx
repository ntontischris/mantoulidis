'use client'

import { useState } from 'react'
import { useMentors, useMyMenteeMentorships } from '@/features/mentorship/hooks/useMentorship'
import { MentorCard } from '@/features/mentorship/components/MentorCard'
import { MentorshipRequestForm } from '@/features/mentorship/components/MentorshipRequestForm'
import type { MentorProfile, MentorFilters } from '@/features/mentorship/types'

interface MentorshipPageContentProps {
  locale: string
}

export function MentorshipPageContent({ locale: _locale }: MentorshipPageContentProps) {
  const [filters, setFilters] = useState<MentorFilters>({})
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { data: mentors, isLoading } = useMentors(filters)
  const { data: myMentorships } = useMyMenteeMentorships()

  // Set of mentor IDs I've already requested
  const requestedMentorIds = new Set(
    (myMentorships ?? [])
      .filter((m) => m.status !== 'declined' && m.status !== 'cancelled')
      .map((m) => m.mentor_id)
  )

  function handleRequest(mentorId: string) {
    const mentor = mentors?.find((m) => m.id === mentorId)
    if (!mentor) return
    setSelectedMentor(mentor)
    setShowForm(true)
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mentorship</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Βρείτε έναν mentor από την κοινότητα αποφοίτων
        </p>
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Αναζήτηση mentor..."
        value={filters.search ?? ''}
        onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
        className="h-9 w-full max-w-sm rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Request form overlay */}
      {showForm && selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-bold text-foreground">Αίτηση Mentorship</h2>
            <MentorshipRequestForm
              mentor={selectedMentor}
              onSuccess={() => {
                setShowForm(false)
                setSelectedMentor(null)
              }}
              onCancel={() => {
                setShowForm(false)
                setSelectedMentor(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Mentors grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : mentors && mentors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onRequest={handleRequest}
              hasExisting={requestedMentorIds.has(mentor.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-3xl">🎓</p>
          <p className="mt-3 font-medium text-foreground">Δεν βρέθηκαν mentors</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Προσαρμόστε τα φίλτρα ή ελέγξτε αργότερα
          </p>
        </div>
      )}
    </div>
  )
}
