import type { BenefitRow, BenefitRedemptionRow } from '@/lib/supabase/types'

export type Benefit = BenefitRow
export type BenefitRedemption = BenefitRedemptionRow

export interface BenefitFilters {
  category?: string
  search?: string
  activeOnly?: boolean
}

export const BENEFIT_CATEGORIES = [
  { value: 'discount', label: 'Εκπτώσεις' },
  { value: 'service', label: 'Υπηρεσίες' },
  { value: 'event', label: 'Εκδηλώσεις' },
  { value: 'travel', label: 'Ταξίδια' },
  { value: 'food', label: 'Εστίαση' },
  { value: 'other', label: 'Άλλο' },
] as const

export type BenefitCategory = (typeof BENEFIT_CATEGORIES)[number]['value']
