import { z } from 'zod'

// Step 1: Personal Info
export const step1Schema = z.object({
  first_name: z.string().min(2, 'Τουλάχιστον 2 χαρακτήρες').max(50),
  last_name: z.string().min(2, 'Τουλάχιστον 2 χαρακτήρες').max(50),
  first_name_en: z.string().max(50).optional(),
  last_name_en: z.string().max(50).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
})

export type Step1Data = z.infer<typeof step1Schema>

// Step 2: Academic & Professional
export const step2Schema = z.object({
  graduation_year: z
    .number()
    .int()
    .min(1990, 'Έτος από 1990')
    .max(2035, 'Έτος έως 2035')
    .optional(),
  department: z.string().max(200).optional(),
  current_position: z.string().max(200).optional(),
  current_company: z.string().max(200).optional(),
  industry: z.string().max(100).optional(),
  linkedin_url: z.string().url('Μη έγκυρο URL').optional().or(z.literal('')),
  website_url: z.string().url('Μη έγκυρο URL').optional().or(z.literal('')),
})

export type Step2Data = z.infer<typeof step2Schema>

// Step 3: Bio & Mentor
export const step3Schema = z.object({
  bio: z.string().max(5000, 'Έως 5000 χαρακτήρες').optional(),
  bio_en: z.string().max(5000, 'Έως 5000 χαρακτήρες').optional(),
  is_mentor: z.boolean(),
})

export type Step3Data = z.infer<typeof step3Schema>

// Step 4: Privacy
export const step4Schema = z.object({
  email_public: z.boolean(),
  phone_public: z.boolean(),
  language_pref: z.enum(['el', 'en']),
})

export type Step4Data = z.infer<typeof step4Schema>

// Full combined type for submission
export type OnboardingData = Step1Data & Step2Data & Step3Data & Step4Data
