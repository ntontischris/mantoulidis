import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import LandingNav from '@/components/landing/LandingNav'
import HeroSection from '@/components/landing/HeroSection'
import StatsSection from '@/components/landing/StatsSection'
import AboutSection from '@/components/landing/AboutSection'
import ActivitiesSection from '@/components/landing/ActivitiesSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import CTASection from '@/components/landing/CTASection'
import LandingFooter from '@/components/landing/LandingFooter'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.hero' })
  return {
    title: 'Alumni Μαντουλίδη — Σύλλογος Αποφοίτων',
    description: t('subtitle'),
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const [tNav, tHero, tStats, tAbout, tActivities, tFeatures, tCta, tFooter] =
    await Promise.all([
      getTranslations({ locale, namespace: 'landing.nav' }),
      getTranslations({ locale, namespace: 'landing.hero' }),
      getTranslations({ locale, namespace: 'landing.stats' }),
      getTranslations({ locale, namespace: 'landing.about' }),
      getTranslations({ locale, namespace: 'landing.activities' }),
      getTranslations({ locale, namespace: 'landing.features' }),
      getTranslations({ locale, namespace: 'landing.cta' }),
      getTranslations({ locale, namespace: 'landing.footer' }),
    ])

  const navStrings = {
    home: tNav('home'),
    about: tNav('about'),
    activities: tNav('activities'),
    platform: tNav('platform'),
    contact: tNav('contact'),
    login: tNav('login'),
  }

  const heroStrings = {
    eyebrow: tHero('eyebrow'),
    line1: tHero('line1'),
    line2: tHero('line2'),
    line3: tHero('line3'),
    subtitle: tHero('subtitle'),
    cta: tHero('cta'),
    ctaSecondary: tHero('ctaSecondary'),
    scrollHint: tHero('scrollHint'),
  }

  const statsStrings = {
    members: { value: tStats('members.value'), label: tStats('members.label') },
    years: { value: tStats('years.value'), label: tStats('years.label') },
    events: { value: tStats('events.value'), label: tStats('events.label') },
    businesses: { value: tStats('businesses.value'), label: tStats('businesses.label') },
  }

  const aboutStrings = {
    eyebrow: tAbout('eyebrow'),
    title: tAbout('title'),
    p1: tAbout('p1'),
    p2: tAbout('p2'),
    quote1: tAbout('quote1'),
    quote2: tAbout('quote2'),
  }

  const activitiesStrings = {
    title: tActivities('title'),
    subtitle: tActivities('subtitle'),
    sports: { title: tActivities('sports.title'), description: tActivities('sports.description') },
    culture: { title: tActivities('culture.title'), description: tActivities('culture.description') },
    europe: { title: tActivities('europe.title'), description: tActivities('europe.description') },
    academic: { title: tActivities('academic.title'), description: tActivities('academic.description') },
  }

  const featuresStrings = {
    title: tFeatures('title'),
    subtitle: tFeatures('subtitle'),
    directory: { title: tFeatures('directory.title'), description: tFeatures('directory.description') },
    jobs: { title: tFeatures('jobs.title'), description: tFeatures('jobs.description') },
    mentorship: { title: tFeatures('mentorship.title'), description: tFeatures('mentorship.description') },
    events: { title: tFeatures('events.title'), description: tFeatures('events.description') },
    gallery: { title: tFeatures('gallery.title'), description: tFeatures('gallery.description') },
    groups: { title: tFeatures('groups.title'), description: tFeatures('groups.description') },
  }

  const ctaStrings = {
    title: tCta('title'),
    subtitle: tCta('subtitle'),
    button: tCta('button'),
  }

  const footerStrings = {
    tagline: tFooter('tagline'),
    linksTitle: tFooter('linksTitle'),
    contactTitle: tFooter('contactTitle'),
    addressTitle: tFooter('addressTitle'),
    email: tFooter('email'),
    phone: tFooter('phone'),
    secretary: tFooter('secretary'),
    address1: tFooter('address1'),
    address2: tFooter('address2'),
    address1Label: tFooter('address1Label'),
    address2Label: tFooter('address2Label'),
    copyright: tFooter('copyright', { year: new Date().getFullYear() }),
    poweredBy: tFooter('poweredBy'),
  }

  return (
    <div className="bg-[#050D1A] min-h-screen">
      <LandingNav locale={locale} t={navStrings} />
      <HeroSection locale={locale} t={heroStrings} />
      <StatsSection t={statsStrings} />
      <AboutSection t={aboutStrings} />
      <ActivitiesSection t={activitiesStrings} />
      <FeaturesSection t={featuresStrings} />
      <CTASection locale={locale} t={ctaStrings} />
      <LandingFooter locale={locale} navT={navStrings} t={footerStrings} />
    </div>
  )
}
