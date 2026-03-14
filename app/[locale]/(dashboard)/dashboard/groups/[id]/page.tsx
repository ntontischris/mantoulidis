import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { JoinGroupButton } from '@/features/groups/components/JoinGroupButton'
import { GroupFeed } from '@/features/groups/components/GroupFeed'

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: group } = await supabase.from('groups').select('*').eq('id', id).single()
  if (!group) notFound()

  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  const isMember = !!membership

  const name = locale === 'en' && group.name_en ? group.name_en : group.name
  const description =
    locale === 'en' && group.description_en ? group.description_en : group.description

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <Link
        href={`/${locale}/dashboard/groups`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Πίσω στις ομάδες
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{name}</h1>
              {group.is_private && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  🔒 Ιδιωτική
                </span>
              )}
            </div>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            <p className="text-xs text-muted-foreground">
              {group.member_count} {group.member_count === 1 ? 'μέλος' : 'μέλη'}
            </p>
          </div>
          <JoinGroupButton groupId={group.id} isMember={isMember} />
        </div>
      </div>

      {/* Feed */}
      {isMember || !group.is_private ? (
        <GroupFeed groupId={group.id} isMember={isMember} />
      ) : (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          🔒 Αυτή είναι ιδιωτική ομάδα. Γίνετε μέλος για να δείτε τις αναρτήσεις.
        </div>
      )}
    </div>
  )
}
