import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Avatar } from '@/components/shared/Avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface MemberProfilePageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function MemberProfilePage({ params }: MemberProfilePageProps) {
  const { locale, id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('onboarding_completed', true)
    .single()

  if (!profile) notFound()

  // Fetch this member's businesses
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', id)
    .eq('is_active', true)

  const isOwnProfile = user.id === id
  const fullName = `${profile.first_name} ${profile.last_name}`
  const fullNameEn =
    profile.first_name_en || profile.last_name_en
      ? `${profile.first_name_en ?? ''} ${profile.last_name_en ?? ''}`.trim()
      : null

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-36 w-full rounded-xl bg-gradient-to-r from-primary to-secondary" />
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <Avatar
            src={profile.avatar_url}
            name={fullName}
            size="xl"
            className="border-4 border-background"
          />
        </div>
      </div>

      <div className="pt-10 space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{fullName}</h1>
            {fullNameEn && <p className="text-muted-foreground">{fullNameEn}</p>}
            {profile.current_position && (
              <p className="text-muted-foreground mt-0.5">
                {profile.current_position}
                {profile.current_company && ` @ ${profile.current_company}`}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.membership_status === 'active' && (
                <Badge>Ενεργό μέλος</Badge>
              )}
              {profile.is_mentor && (
                <Badge variant="secondary">Μέντορας</Badge>
              )}
              {profile.graduation_year && (
                <Badge variant="outline">Αποφοίτηση {profile.graduation_year}</Badge>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            {isOwnProfile ? (
              <Button asChild size="sm">
                <Link href={`/${locale}/dashboard/profile/edit`}>Επεξεργασία</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link href={`/${locale}/dashboard/messages?to=${id}`}>Μήνυμα</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">Σχετικά</TabsTrigger>
          <TabsTrigger value="business">
            Επιχειρήσεις {businesses && businesses.length > 0 && `(${businesses.length})`}
          </TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6 pt-4">
          {profile.bio && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Βιογραφικό
              </h2>
              <p className="text-sm text-foreground whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            {profile.department && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Τμήμα</p>
                <p className="mt-1">{profile.department}</p>
              </div>
            )}
            {profile.industry && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Κλάδος</p>
                <p className="mt-1">{profile.industry}</p>
              </div>
            )}
            {(profile.city || profile.country) && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Τοποθεσία</p>
                <p className="mt-1">
                  {[profile.city, profile.country].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Links */}
          {(profile.linkedin_url || profile.website_url || (profile.email_public && user)) && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-3 text-sm">
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn
                  </a>
                )}
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Website
                  </a>
                )}
              </div>
            </>
          )}
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="pt-4">
          {!businesses || businesses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {isOwnProfile
                ? 'Δεν έχετε καταχωρήσει επιχείρηση ακόμα.'
                : 'Δεν υπάρχουν καταχωρημένες επιχειρήσεις.'}
            </p>
          ) : (
            <div className="space-y-3">
              {businesses.map((biz) => (
                <Link
                  key={biz.id}
                  href={`/${locale}/dashboard/businesses/${biz.id}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
                    🏢
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{biz.name}</p>
                    {biz.category && (
                      <p className="text-sm text-muted-foreground">{biz.category}</p>
                    )}
                    {biz.city && (
                      <p className="text-xs text-muted-foreground">{biz.city}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {isOwnProfile && (
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/dashboard/businesses/new`}>
                  + Προσθήκη επιχείρησης
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
