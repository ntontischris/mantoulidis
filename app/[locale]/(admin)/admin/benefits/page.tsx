'use client'

import { useRouter, useParams } from 'next/navigation'
import { useAdminBenefits } from '@/features/admin/hooks/useAdmin'
import { useDeleteBenefit, useUpdateBenefit } from '@/features/benefits/hooks/useBenefits'
import type { BenefitRow } from '@/lib/supabase/types'

export default function AdminBenefitsPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const { data: benefits, isLoading } = useAdminBenefits()
  const { mutate: deleteBenefit } = useDeleteBenefit()

  const CATEGORY_LABELS: Record<string, string> = {
    discount: 'Εκπτώσεις',
    service: 'Υπηρεσίες',
    event: 'Εκδηλώσεις',
    travel: 'Ταξίδια',
    food: 'Εστίαση',
    other: 'Άλλο',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Διαχείριση Παροχών</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Δημιουργία και επεξεργασία παροχών μελών
          </p>
        </div>
        <button
          onClick={() => router.push(`/${locale}/dashboard/benefits/new`)}
          className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Νέα Παροχή
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Τίτλος</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Συνεργάτης
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Κατηγορία</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Κατάσταση</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Λήξη</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Εξαργυρώσεις
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ενέργειες</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {benefits && benefits.length > 0 ? (
                benefits.map((b) => (
                  <BenefitRow
                    key={b.id}
                    benefit={b}
                    categoryLabel={CATEGORY_LABELS[b.category] ?? b.category}
                    onEdit={() => router.push(`/${locale}/dashboard/benefits/${b.id}/edit`)}
                    onDelete={() => {
                      if (window.confirm('Να διαγραφεί αυτή η παροχή;')) {
                        deleteBenefit(b.id)
                      }
                    }}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Δεν υπάρχουν παροχές
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function BenefitRow({
  benefit,
  categoryLabel,
  onEdit,
  onDelete,
}: {
  benefit: BenefitRow
  categoryLabel: string
  onEdit: () => void
  onDelete: () => void
}) {
  const { mutate: updateBenefit } = useUpdateBenefit(benefit.id)

  return (
    <tr className="hover:bg-muted/30">
      <td className="px-4 py-3">
        <p className="font-medium text-foreground">{benefit.title}</p>
        {benefit.discount_text && (
          <p className="text-xs text-muted-foreground">{benefit.discount_text}</p>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{benefit.partner_name}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{categoryLabel}</td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            benefit.is_active
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {benefit.is_active ? 'Ενεργό' : 'Ανενεργό'}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {benefit.valid_until ? new Date(benefit.valid_until).toLocaleDateString('el-GR') : '—'}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {benefit.redemption_count}
        {benefit.max_redemptions != null && ` / ${benefit.max_redemptions}`}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => updateBenefit({ is_active: !benefit.is_active })}
            className="text-xs text-blue-600 hover:underline"
          >
            {benefit.is_active ? 'Απενεργ.' : 'Ενεργ.'}
          </button>
          <button onClick={onEdit} className="text-xs text-foreground hover:underline">
            Επεξ.
          </button>
          <button onClick={onDelete} className="text-xs text-destructive hover:underline">
            Διαγ.
          </button>
        </div>
      </td>
    </tr>
  )
}
