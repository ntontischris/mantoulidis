'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Progress } from '@/components/ui/progress'
import { OnboardingStep1 } from './OnboardingStep1'
import { OnboardingStep2 } from './OnboardingStep2'
import { OnboardingStep3 } from './OnboardingStep3'
import { OnboardingStep4 } from './OnboardingStep4'
import type { Step1Data, Step2Data, Step3Data, Step4Data, OnboardingData } from '../schemas/onboarding.schemas'

const STEPS = [
  { label: 'Προσωπικά', description: 'Βασικά στοιχεία' },
  { label: 'Επαγγελματικά', description: 'Καριέρα & σπουδές' },
  { label: 'Βιογραφικό', description: 'Παρουσίαση' },
  { label: 'Ρυθμίσεις', description: 'Απόρρητο & γλώσσα' },
]

interface OnboardingWizardProps {
  locale: string
  initialData?: Partial<OnboardingData>
}

export function OnboardingWizard({ locale, initialData }: OnboardingWizardProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<Partial<OnboardingData>>(initialData ?? {})
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, setProfile } = useAuthStore()

  const handleStep1 = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(1)
  }

  const handleStep2 = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(2)
  }

  const handleStep3 = (data: Step3Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(3)
  }

  const handleStep4 = async (data: Step4Data) => {
    if (!user) return
    setIsPending(true)
    setError(null)

    const finalData: Partial<OnboardingData> = { ...formData, ...data }

    try {
      const supabase = createClient()
      const { data: profile, error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: finalData.first_name ?? '',
          last_name: finalData.last_name ?? '',
          first_name_en: finalData.first_name_en ?? null,
          last_name_en: finalData.last_name_en ?? null,
          city: finalData.city ?? null,
          country: finalData.country ?? 'Ελλάδα',
          phone: finalData.phone ?? null,
          graduation_year: finalData.graduation_year ?? null,
          department: finalData.department ?? null,
          current_position: finalData.current_position ?? null,
          current_company: finalData.current_company ?? null,
          industry: finalData.industry ?? null,
          linkedin_url: finalData.linkedin_url || null,
          website_url: finalData.website_url || null,
          bio: finalData.bio ?? null,
          bio_en: finalData.bio_en ?? null,
          is_mentor: finalData.is_mentor ?? false,
          email_public: finalData.email_public ?? true,
          phone_public: finalData.phone_public ?? false,
          language_pref: finalData.language_pref ?? 'el',
          onboarding_completed: true,
        })
        .eq('id', user.id)
        .select('*')
        .single()

      if (updateError) {
        setError('Σφάλμα αποθήκευσης. Παρακαλώ δοκιμάστε ξανά.')
        return
      }

      if (profile) {
        setProfile(profile)
      }

      router.push(`/${locale}/dashboard/home`)
    } finally {
      setIsPending(false)
    }
  }

  const progressValue = ((step + 1) / STEPS.length) * 100

  return (
    <div className="w-full max-w-lg space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Βήμα {step + 1} από {STEPS.length}</span>
          <span>{STEPS[step]?.label}</span>
        </div>
        <Progress value={progressValue} className="h-2" />
        <p className="text-xs text-muted-foreground">{STEPS[step]?.description}</p>
      </div>

      {/* Step tabs indicator */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full h-1.5 transition-colors ${
              i <= step ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Steps */}
      {step === 0 && (
        <OnboardingStep1
          defaultValues={formData}
          onNext={handleStep1}
        />
      )}
      {step === 1 && (
        <OnboardingStep2
          defaultValues={formData}
          onNext={handleStep2}
          onBack={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <OnboardingStep3
          defaultValues={formData}
          onNext={handleStep3}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <OnboardingStep4
          defaultValues={formData}
          onSubmit={handleStep4}
          onBack={() => setStep(2)}
          isPending={isPending}
        />
      )}
    </div>
  )
}
