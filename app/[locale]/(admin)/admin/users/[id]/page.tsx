'use client'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import type { UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAdminUser, useAdminUpdateProfile } from '@/features/admin/hooks/useAdmin'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ProfileRow } from '@/lib/supabase/types'

type ProfileSaveData = Partial<
  Omit<ProfileRow, 'id' | 'created_at' | 'updated_at' | 'search_vector' | 'membership_number'>
>

const profileSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  first_name_en: z.string().optional(),
  last_name_en: z.string().optional(),
  graduation_year: z.string().optional(),
  department: z.string().optional(),
  current_position: z.string().optional(),
  current_company: z.string().optional(),
  industry: z.string().optional(),
  bio: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  linkedin_url: z.string().optional(),
  website_url: z.string().optional(),
  phone: z.string().optional(),
  is_mentor: z.boolean(),
  phone_public: z.boolean(),
  email_public: z.boolean(),
  role: z.enum(['super_admin', 'admin', 'verified_member', 'basic_member']),
  membership_status: z.enum(['active', 'inactive', 'suspended']),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const ROLE_OPTIONS = [
  { value: 'basic_member', label: 'Βασικό Μέλος' },
  { value: 'verified_member', label: 'Verified Μέλος' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Ενεργό' },
  { value: 'inactive', label: 'Ανενεργό' },
  { value: 'suspended', label: 'Σε Αναστολή' },
]

export default function AdminUserDetailPage() {
  const { id, locale } = useParams<{ id: string; locale: string }>()
  const router = useRouter()
  const { data: profile, isLoading } = useAdminUser(id)
  const { mutateAsync: updateProfile, isPending } = useAdminUpdateProfile(id)

  if (isLoading) return <LoadingSpinner />

  if (!profile) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">Ο χρήστης δεν βρέθηκε.</div>
    )
  }

  return (
    <AdminUserForm
      profile={profile}
      onSave={updateProfile}
      isPending={isPending}
      onBack={() => router.push(`/${locale}/admin/users`)}
    />
  )
}

function AdminUserForm({
  profile,
  onSave,
  isPending,
  onBack,
}: {
  profile: {
    id: string
    first_name: string
    last_name: string
    first_name_en: string | null
    last_name_en: string | null
    graduation_year: number | null
    department: string | null
    current_position: string | null
    current_company: string | null
    industry: string | null
    bio: string | null
    city: string | null
    country: string | null
    linkedin_url: string | null
    website_url: string | null
    phone: string | null
    is_mentor: boolean
    phone_public: boolean
    email_public: boolean
    role: 'super_admin' | 'admin' | 'verified_member' | 'basic_member'
    membership_status: 'active' | 'inactive' | 'suspended'
    membership_number: string | null
    created_at: string
  }
  locale?: string
  onSave: (data: ProfileSaveData) => Promise<void>
  isPending: boolean
  onBack: () => void
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      first_name_en: profile.first_name_en ?? '',
      last_name_en: profile.last_name_en ?? '',
      graduation_year: profile.graduation_year != null ? String(profile.graduation_year) : '',
      department: profile.department ?? '',
      current_position: profile.current_position ?? '',
      current_company: profile.current_company ?? '',
      industry: profile.industry ?? '',
      bio: profile.bio ?? '',
      city: profile.city ?? '',
      country: profile.country ?? '',
      linkedin_url: profile.linkedin_url ?? '',
      website_url: profile.website_url ?? '',
      phone: profile.phone ?? '',
      is_mentor: profile.is_mentor,
      phone_public: profile.phone_public,
      email_public: profile.email_public,
      role: profile.role,
      membership_status: profile.membership_status,
    },
  })

  async function handleSubmitForm(values: ProfileFormValues) {
    const saveData: ProfileSaveData = {
      first_name: values.first_name,
      last_name: values.last_name,
      first_name_en: values.first_name_en || null,
      last_name_en: values.last_name_en || null,
      graduation_year: values.graduation_year ? parseInt(values.graduation_year) : null,
      department: values.department || null,
      current_position: values.current_position || null,
      current_company: values.current_company || null,
      industry: values.industry || null,
      bio: values.bio || null,
      city: values.city || null,
      country: values.country || null,
      linkedin_url: values.linkedin_url || null,
      website_url: values.website_url || null,
      phone: values.phone || null,
      is_mentor: values.is_mentor,
      phone_public: values.phone_public,
      email_public: values.email_public,
      role: values.role,
      membership_status: values.membership_status,
    }
    await onSave(saveData)
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Πίσω στους χρήστες
          </button>
          <h1 className="text-2xl font-bold text-foreground">
            {profile.first_name} {profile.last_name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Αρ. Μέλους: {profile.membership_number ?? '—'} · Εγγραφή:{' '}
            {new Date(profile.created_at).toLocaleDateString('el-GR')}
          </p>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Αποθήκευση...' : 'Αποθήκευση'}
        </Button>
      </div>

      {/* Read-only info */}
      <div className="bg-muted/30 rounded-xl border border-border p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Μόνο Ανάγνωση
        </p>
        <p className="font-mono text-sm text-foreground">{profile.id}</p>
      </div>

      {/* Status & Role */}
      <Section title="Κατάσταση & Ρόλος">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SelectField
            label="Ρόλος"
            value={watch('role')}
            onChange={(v) => setValue('role', v as ProfileFormValues['role'])}
            options={ROLE_OPTIONS}
          />
          <SelectField
            label="Κατάσταση Μέλους"
            value={watch('membership_status')}
            onChange={(v) =>
              setValue('membership_status', v as ProfileFormValues['membership_status'])
            }
            options={STATUS_OPTIONS}
          />
        </div>
      </Section>

      {/* Identity */}
      <Section title="Ταυτότητα">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Όνομα (Ελληνικά)" error={errors.first_name?.message}>
            <Input {...register('first_name')} />
          </FormField>
          <FormField label="Επώνυμο (Ελληνικά)" error={errors.last_name?.message}>
            <Input {...register('last_name')} />
          </FormField>
          <FormField label="First Name (English)">
            <Input {...register('first_name_en')} />
          </FormField>
          <FormField label="Last Name (English)">
            <Input {...register('last_name_en')} />
          </FormField>
        </div>
      </Section>

      {/* Academic */}
      <Section title="Ακαδημαϊκά Στοιχεία">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Έτος Αποφοίτησης">
            <Input {...register('graduation_year')} type="number" min={1970} max={2030} />
          </FormField>
          <FormField label="Τμήμα">
            <Input {...register('department')} />
          </FormField>
        </div>
      </Section>

      {/* Professional */}
      <Section title="Επαγγελματικά Στοιχεία">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Τρέχουσα Θέση">
            <Input {...register('current_position')} />
          </FormField>
          <FormField label="Εταιρεία">
            <Input {...register('current_company')} />
          </FormField>
          <FormField label="Κλάδος">
            <Input {...register('industry')} />
          </FormField>
        </div>
        <FormField label="Βιογραφικό Σημείωμα">
          <Textarea {...register('bio')} rows={4} />
        </FormField>
      </Section>

      {/* Contact */}
      <Section title="Επικοινωνία">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Πόλη">
            <Input {...register('city')} />
          </FormField>
          <FormField label="Χώρα">
            <Input {...register('country')} />
          </FormField>
          <FormField label="LinkedIn URL">
            <Input {...register('linkedin_url')} type="url" />
          </FormField>
          <FormField label="Προσωπικό Website">
            <Input {...register('website_url')} type="url" />
          </FormField>
          <FormField label="Τηλέφωνο">
            <Input {...register('phone')} type="tel" />
          </FormField>
        </div>
      </Section>

      {/* Privacy */}
      <Section title="Ρυθμίσεις Απορρήτου">
        <div className="flex flex-col gap-3">
          <CheckField id="is_mentor" label="Διαθέσιμος ως Mentor" register={register} />
          <CheckField id="phone_public" label="Δημόσιος αριθμός τηλεφώνου" register={register} />
          <CheckField id="email_public" label="Δημόσιο email" register={register} />
        </div>
      </Section>

      <div className="flex justify-end pb-8">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Αποθήκευση...' : 'Αποθήκευση αλλαγών'}
        </Button>
      </div>
    </form>
  )
}

// ── Helper components ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">{title}</h2>
      {children}
    </div>
  )
}

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function CheckField({
  id,
  label,
  register,
}: {
  id: keyof ProfileFormValues
  label: string
  register: UseFormRegister<ProfileFormValues>
}) {
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" id={id} {...register(id)} className="rounded border-border" />
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
    </div>
  )
}
