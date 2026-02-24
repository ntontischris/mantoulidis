import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/PageHeader'
import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard'

interface EditProfilePageProps {
  params: Promise<{ locale: string }>
}

export default async function EditProfilePage({ params }: EditProfilePageProps) {
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Επεξεργασία προφίλ"
        subtitle="Ενημερώστε τα στοιχεία του προφίλ σας"
      />

      {/* Reuse the onboarding wizard with existing data — it will update the profile */}
      <OnboardingWizard
        locale={locale}
        initialData={{
          first_name: profile.first_name,
          last_name: profile.last_name,
          first_name_en: profile.first_name_en ?? '',
          last_name_en: profile.last_name_en ?? '',
          city: profile.city ?? '',
          country: profile.country ?? 'Ελλάδα',
          phone: profile.phone ?? '',
          graduation_year: profile.graduation_year ?? undefined,
          department: profile.department ?? '',
          current_position: profile.current_position ?? '',
          current_company: profile.current_company ?? '',
          industry: profile.industry ?? '',
          linkedin_url: profile.linkedin_url ?? '',
          website_url: profile.website_url ?? '',
          bio: profile.bio ?? '',
          bio_en: profile.bio_en ?? '',
          is_mentor: profile.is_mentor,
          email_public: profile.email_public,
          phone_public: profile.phone_public,
          language_pref: (profile.language_pref as 'el' | 'en' | undefined) ?? 'el',
        }}
      />
    </div>
  )
}
