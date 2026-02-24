import Link from 'next/link'
import type { Tables } from '@/lib/supabase/types'
import { Avatar } from '@/components/shared/Avatar'
import { Badge } from '@/components/ui/badge'

type Profile = Tables<'profiles'>

interface MemberCardProps {
  member: Profile
  locale: string
  view?: 'grid' | 'list'
}

export function MemberCard({ member, locale, view = 'grid' }: MemberCardProps) {
  const fullName = `${member.first_name} ${member.last_name}`
  const href = `/${locale}/dashboard/directory/${member.id}`

  if (view === 'list') {
    return (
      <Link
        href={href}
        className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/5"
      >
        <Avatar src={member.avatar_url} name={fullName} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-foreground">{fullName}</p>
            {member.is_mentor && (
              <Badge variant="secondary" className="shrink-0 text-xs">Μέντορας</Badge>
            )}
          </div>
          {member.current_position && (
            <p className="truncate text-sm text-muted-foreground">
              {member.current_position}
              {member.current_company && ` @ ${member.current_company}`}
            </p>
          )}
        </div>
        <div className="hidden shrink-0 text-right sm:block">
          {member.graduation_year && (
            <p className="text-xs text-muted-foreground">{member.graduation_year}</p>
          )}
          {member.industry && (
            <p className="truncate text-xs text-muted-foreground max-w-[140px]">{member.industry}</p>
          )}
        </div>
      </Link>
    )
  }

  // Grid view
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition-all hover:border-primary/40 hover:shadow-md"
    >
      <Avatar src={member.avatar_url} name={fullName} size="lg" />
      <div className="min-w-0 w-full space-y-0.5">
        <p className="truncate font-semibold text-foreground">{fullName}</p>
        {member.current_position && (
          <p className="truncate text-xs text-muted-foreground">
            {member.current_position}
          </p>
        )}
        {member.current_company && (
          <p className="truncate text-xs text-muted-foreground">{member.current_company}</p>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {member.graduation_year && (
          <Badge variant="outline" className="text-xs">{member.graduation_year}</Badge>
        )}
        {member.is_mentor && (
          <Badge variant="secondary" className="text-xs">Μέντορας</Badge>
        )}
      </div>
    </Link>
  )
}
