import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/PageHeader'
import { Avatar } from '@/components/shared/Avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MembershipCard } from '@/features/profile/components/MembershipCard'

interface ProfilePageProps {
  params: Promise<{ locale: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect(`/${locale}/onboarding`)

  const statusBadge: Record<string, 'default' | 'secondary' | 'destructive'> = {
    active: 'default',
    inactive: 'secondary',
    suspended: 'destructive',
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Το προφίλ μου"
        action={
          <Button asChild size="sm">
            <Link href={`/${locale}/dashboard/profile/edit`}>Επεξεργασία</Link>
          </Button>
        }
      />

      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-32 w-full rounded-xl bg-gradient-to-r from-primary to-secondary" />
        <div className="absolute -bottom-10 left-6">
          <Avatar
            src={profile.avatar_url}
            name={`${profile.first_name} ${profile.last_name}`}
            size="xl"
            className="border-4 border-background"
          />
        </div>
      </div>

      <div className="pt-8 space-y-6">
        {/* Name & status */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {profile.first_name} {profile.last_name}
            </h2>
            {(profile.first_name_en || profile.last_name_en) && (
              <p className="text-muted-foreground">
                {profile.first_name_en} {profile.last_name_en}
              </p>
            )}
            {profile.current_position && (
              <p className="text-muted-foreground mt-0.5">
                {profile.current_position}
                {profile.current_company && ` @ ${profile.current_company}`}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            <Badge variant={statusBadge[profile.membership_status] ?? 'secondary'}>
              {profile.membership_status === 'active' ? 'Ενεργό' :
               profile.membership_status === 'inactive' ? 'Ανενεργό' : 'Ανασταλμένο'}
            </Badge>
            {profile.is_mentor && (
              <Badge variant="secondary">Μέντορας</Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Info grid */}
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          {profile.graduation_year && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Έτος αποφοίτησης</p>
              <p className="mt-1 font-medium">{profile.graduation_year}</p>
            </div>
          )}
          {profile.department && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Τμήμα</p>
              <p className="mt-1 font-medium">{profile.department}</p>
            </div>
          )}
          {profile.industry && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Κλάδος</p>
              <p className="mt-1 font-medium">{profile.industry}</p>
            </div>
          )}
          {(profile.city || profile.country) && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Τοποθεσία</p>
              <p className="mt-1 font-medium">
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Βιογραφικό
              </p>
              <p className="text-sm text-foreground whitespace-pre-wrap">{profile.bio}</p>
            </div>
          </>
        )}

        {/* Links */}
        {(profile.linkedin_url || profile.website_url) && (
          <>
            <Separator />
            <div className="flex gap-3">
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Website
                </a>
              )}
            </div>
          </>
        )}

        {/* Membership card */}
        {profile.membership_status === 'active' && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-semibold text-foreground mb-4">Κάρτα μέλους</p>
              <MembershipCard profile={profile} email={user.email ?? ''} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
