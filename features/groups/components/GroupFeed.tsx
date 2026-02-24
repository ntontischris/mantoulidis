'use client'

import { useState } from 'react'
import { useGroupPosts, useCreateGroupPost, useDeleteGroupPost } from '../hooks/useGroups'

interface GroupFeedProps {
  groupId: string
  isMember: boolean
}

export function GroupFeed({ groupId, isMember }: GroupFeedProps) {
  const { data: posts, isLoading } = useGroupPosts(groupId)
  const { mutate: createPost, isPending } = useCreateGroupPost(groupId)
  const { mutate: deletePost } = useDeleteGroupPost(groupId)
  const [content, setContent] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    createPost(content.trim(), {
      onSuccess: () => setContent(''),
    })
  }

  return (
    <div className="space-y-4">
      {/* Post input */}
      {isMember && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Γράψτε κάτι στην ομάδα..."
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? 'Δημοσίευση...' : 'Δημοσίευση'}
            </button>
          </div>
        </form>
      )}

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <article key={post.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {post.author?.first_name?.[0] ?? '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {post.author
                        ? `${post.author.first_name} ${post.author.last_name}`
                        : 'Άγνωστος'}
                    </p>
                    <time className="shrink-0 text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString('el-GR')}
                    </time>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>
              </div>
              {isMember && (
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => deletePost(post.id)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Διαγραφή
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          Δεν υπάρχουν αναρτήσεις ακόμα.{isMember ? ' Γράψτε κάτι!' : ''}
        </div>
      )}
    </div>
  )
}
