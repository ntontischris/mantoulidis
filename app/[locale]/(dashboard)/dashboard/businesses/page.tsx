import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { BusinessCard } from '@/features/businesses/components/BusinessCard'

interface BusinessesPageProps {
  params: Promise<{ locale: string }>
}

export default async function BusinessesPage({ params }: BusinessesPageProps) {
  const { locale } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  const canCreate =
    profile?.role === 'verified_member' ||
    profile?.role === 'admin' ||
    profile?.role === 'super_admin'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Επιχειρήσεις Αποφοίτων"
        subtitle="Ανακαλύψτε επιχειρήσεις μελών της κοινότητας"
        action={
          canCreate ? (
            <Button asChild size="sm">
              <Link href={`/${locale}/dashboard/businesses/new`}>+ Προσθήκη</Link>
            </Button>
          ) : undefined
        }
      />

      {!businesses || businesses.length === 0 ? (
        <EmptyState
          title="Δεν υπάρχουν επιχειρήσεις ακόμα"
          description={canCreate ? 'Καταχωρήστε την επιχείρησή σας' : 'Σύντομα!'}
          action={
            canCreate ? (
              <Button asChild size="sm">
                <Link href={`/${locale}/dashboard/businesses/new`}>+ Προσθήκη</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
