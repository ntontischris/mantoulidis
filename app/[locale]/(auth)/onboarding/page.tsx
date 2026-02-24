import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard'

interface OnboardingPageProps {
  params: Promise<{ locale: string }>
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Already completed onboarding — go to dashboard
  if (profile?.onboarding_completed) {
    redirect(`/${locale}/dashboard/home`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <div className="text-center space-y-1">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-primary-foreground">
          AC
        </div>
        <h1 className="text-2xl font-bold text-foreground mt-3">
          Καλώς ήρθατε στο Alumni Connect!
        </h1>
        <p className="text-sm text-muted-foreground">
          Συμπληρώστε το προφίλ σας για να αρχίσετε να χρησιμοποιείτε την πλατφόρμα.
        </p>
      </div>

      <OnboardingWizard
        locale={locale}
        initialData={{
          first_name: profile?.first_name ?? '',
          last_name: profile?.last_name ?? '',
          first_name_en: profile?.first_name_en ?? '',
          last_name_en: profile?.last_name_en ?? '',
          city: profile?.city ?? '',
          country: profile?.country ?? 'Ελλάδα',
          phone: profile?.phone ?? '',
          graduation_year: profile?.graduation_year ?? undefined,
          department: profile?.department ?? '',
          current_position: profile?.current_position ?? '',
          current_company: profile?.current_company ?? '',
          industry: profile?.industry ?? '',
          linkedin_url: profile?.linkedin_url ?? '',
          website_url: profile?.website_url ?? '',
          bio: profile?.bio ?? '',
          bio_en: profile?.bio_en ?? '',
          is_mentor: profile?.is_mentor ?? false,
          email_public: profile?.email_public ?? true,
          phone_public: profile?.phone_public ?? false,
          language_pref: (profile?.language_pref as 'el' | 'en' | undefined) ?? 'el',
        }}
      />
    </div>
  )
}
