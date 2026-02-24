'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useJobs } from '@/features/jobs/hooks/useJobs'
import { JobCard } from '@/features/jobs/components/JobCard'
import { JobFiltersBar } from '@/features/jobs/components/JobFilters'
import type { JobFilters } from '@/features/jobs/types'

export default function JobsPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const [filters, setFilters] = useState<JobFilters>({})
  const { data: jobs, isLoading } = useJobs(filters)

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Αγγελίες Εργασίας</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ευκαιρίες από την κοινότητα αποφοίτων
          </p>
        </div>
        <button
          onClick={() => router.push(`/${locale}/dashboard/jobs/new`)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          + Νέα Αγγελία
        </button>
      </div>

      {/* Filters */}
      <JobFiltersBar filters={filters} onChange={setFilters} />

      {/* Jobs grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-3xl">💼</p>
          <p className="mt-3 font-medium text-foreground">Δεν βρέθηκαν αγγελίες</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Δοκιμάστε διαφορετικά φίλτρα ή δημοσιεύστε μια νέα αγγελία
          </p>
        </div>
      )}
    </div>
  )
}
