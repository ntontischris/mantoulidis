import { z } from 'zod'

// ============================================================
// SIGN IN
// ============================================================

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Το email είναι υποχρεωτικό')
    .email('Μη έγκυρο email'),
  password: z
    .string()
    .min(1, 'Ο κωδικός είναι υποχρεωτικός')
    .min(8, 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες'),
})

export type SignInFormData = z.infer<typeof signInSchema>

// ============================================================
// SIGN UP
// ============================================================

export const signUpSchema = z
  .object({
    first_name: z
      .string()
      .min(1, 'Το όνομα είναι υποχρεωτικό')
      .min(2, 'Τουλάχιστον 2 χαρακτήρες')
      .max(50, 'Έως 50 χαρακτήρες'),
    last_name: z
      .string()
      .min(1, 'Το επώνυμο είναι υποχρεωτικό')
      .min(2, 'Τουλάχιστον 2 χαρακτήρες')
      .max(50, 'Έως 50 χαρακτήρες'),
    email: z
      .string()
      .min(1, 'Το email είναι υποχρεωτικό')
      .email('Μη έγκυρο email'),
    password: z
      .string()
      .min(8, 'Τουλάχιστον 8 χαρακτήρες')
      .regex(/[A-Z]/, 'Πρέπει να περιέχει κεφαλαίο γράμμα')
      .regex(/[0-9]/, 'Πρέπει να περιέχει αριθμό'),
    confirmPassword: z.string().min(1, 'Επιβεβαίωση κωδικού υποχρεωτική'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Οι κωδικοί δεν ταιριάζουν',
    path: ['confirmPassword'],
  })

export type SignUpFormData = z.infer<typeof signUpSchema>

// ============================================================
// MAGIC LINK
// ============================================================

export const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, 'Το email είναι υποχρεωτικό')
    .email('Μη έγκυρο email'),
})

export type MagicLinkFormData = z.infer<typeof magicLinkSchema>

// ============================================================
// FORGOT PASSWORD
// ============================================================

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Το email είναι υποχρεωτικό')
    .email('Μη έγκυρο email'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// ============================================================
// UPDATE PASSWORD
// ============================================================

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Τουλάχιστον 8 χαρακτήρες')
      .regex(/[A-Z]/, 'Πρέπει να περιέχει κεφαλαίο γράμμα')
      .regex(/[0-9]/, 'Πρέπει να περιέχει αριθμό'),
    confirmPassword: z.string().min(1, 'Επιβεβαίωση κωδικού υποχρεωτική'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Οι κωδικοί δεν ταιριάζουν',
    path: ['confirmPassword'],
  })

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>
