'use client'

import { usePollVote } from '../hooks/useNews'
import type { PollWithOptions } from '../hooks/useNews'

interface PollCardProps {
  poll: PollWithOptions
  locale: string
}

export function PollCard({ poll, locale }: PollCardProps) {
  const { mutate: vote, isPending } = usePollVote()
  const question = locale === 'en' && poll.question_en ? poll.question_en : poll.question
  const hasVoted = !!poll.my_vote
  const isClosed = !poll.is_active || (poll.closes_at ? new Date(poll.closes_at) < new Date() : false)

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground">{question}</h3>
        {isClosed && (
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            Έκλεισε
          </span>
        )}
      </div>

      <div className="space-y-2">
        {poll.options
          .sort((a, b) => a.position - b.position)
          .map((opt) => {
            const label = locale === 'en' && opt.text_en ? opt.text_en : opt.text
            const pct = poll.total_votes > 0
              ? Math.round((opt.vote_count / poll.total_votes) * 100)
              : 0
            const isMyVote = poll.my_vote?.option_id === opt.id

            return (
              <button
                key={opt.id}
                type="button"
                disabled={hasVoted || isClosed || isPending}
                onClick={() => vote({ pollId: poll.id, optionId: opt.id })}
                className="relative w-full rounded-lg border border-border overflow-hidden text-left transition-colors hover:border-primary disabled:cursor-default"
              >
                {/* Progress bar */}
                {(hasVoted || isClosed) && (
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/10 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between px-3 py-2.5">
                  <span className="text-sm font-medium flex items-center gap-2">
                    {isMyVote && <span className="text-primary">✓</span>}
                    {label}
                  </span>
                  {(hasVoted || isClosed) && (
                    <span className="text-xs font-semibold text-muted-foreground">{pct}%</span>
                  )}
                </div>
              </button>
            )
          })}
      </div>

      <p className="text-xs text-muted-foreground">
        {poll.total_votes} {poll.total_votes === 1 ? 'ψήφος' : 'ψήφοι'}
        {poll.closes_at && !isClosed && (
          <> · Λήγει {new Date(poll.closes_at).toLocaleDateString('el-GR')}</>
        )}
      </p>
    </div>
  )
}
