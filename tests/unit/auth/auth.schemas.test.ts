import { describe, it, expect } from 'vitest'
import {
  signInSchema,
  signUpSchema,
  magicLinkSchema,
  forgotPasswordSchema,
  updatePasswordSchema,
} from '@/features/auth/schemas/auth.schemas'

describe('signInSchema', () => {
  it('validates correct credentials', () => {
    const result = signInSchema.safeParse({
      email: 'test@example.com',
      password: 'Password1',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = signInSchema.safeParse({
      email: 'not-an-email',
      password: 'Password1',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = signInSchema.safeParse({
      email: 'test@example.com',
      password: '1234567',
    })
    expect(result.success).toBe(false)
  })
})

describe('signUpSchema', () => {
  const valid = {
    first_name: 'Γιώργος',
    last_name: 'Παπαδόπουλος',
    email: 'test@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
  }

  it('validates correct data', () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = signUpSchema.safeParse({
      ...valid,
      confirmPassword: 'Different1',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'))
      expect(paths).toContain('confirmPassword')
    }
  })

  it('rejects password without uppercase', () => {
    const result = signUpSchema.safeParse({
      ...valid,
      password: 'password1',
      confirmPassword: 'password1',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password without number', () => {
    const result = signUpSchema.safeParse({
      ...valid,
      password: 'Passwordonly',
      confirmPassword: 'Passwordonly',
    })
    expect(result.success).toBe(false)
  })

  it('rejects name shorter than 2 chars', () => {
    const result = signUpSchema.safeParse({ ...valid, first_name: 'A' })
    expect(result.success).toBe(false)
  })
})

describe('magicLinkSchema', () => {
  it('validates correct email', () => {
    expect(magicLinkSchema.safeParse({ email: 'test@example.com' }).success).toBe(true)
  })

  it('rejects empty email', () => {
    expect(magicLinkSchema.safeParse({ email: '' }).success).toBe(false)
  })
})

describe('forgotPasswordSchema', () => {
  it('validates correct email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'test@example.com' }).success).toBe(true)
  })
})

describe('updatePasswordSchema', () => {
  it('validates matching strong passwords', () => {
    const result = updatePasswordSchema.safeParse({
      password: 'NewPass1',
      confirmPassword: 'NewPass1',
    })
    expect(result.success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = updatePasswordSchema.safeParse({
      password: 'NewPass1',
      confirmPassword: 'Different1',
    })
    expect(result.success).toBe(false)
  })
})
