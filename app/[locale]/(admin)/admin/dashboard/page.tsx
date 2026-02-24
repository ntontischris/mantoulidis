'use client'

import dynamic from 'next/dynamic'
import { usePlatformStats, useMemberGrowth } from '@/features/admin/hooks/useAdmin'

const BarChart = dynamic(() => import('recharts').then((m) => m.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then((m) => m.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((m) => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((m) => m.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then((m) => m.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((m) => m.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then((m) => m.ResponsiveContainer), { ssr: false })

export default function AdminDashboardPage() {
  const { data: stats, isLoading: loadingStats } = usePlatformStats()
  const { data: growth, isLoading: loadingGrowth } = useMemberGrowth()

  const statCards = stats
    ? [
        { label: 'Σύνολο Μελών', value: stats.totalMembers, color: 'text-primary' },
        { label: 'Ενεργά Μέλη', value: stats.activeMembers, color: 'text-green-600' },
        { label: 'Verified Μέλη', value: stats.verifiedMembers, color: 'text-blue-600' },
        { label: 'Προς Έλεγχο', value: stats.pendingModeration, color: 'text-orange-600' },
        { label: 'Εκδηλώσεις', value: stats.totalEvents, color: 'text-purple-600' },
        { label: 'Αγγελίες', value: stats.totalJobs, color: 'text-foreground' },
        { label: 'Ομάδες', value: stats.totalGroups, color: 'text-foreground' },
        { label: 'Μηνύματα', value: stats.totalMessages, color: 'text-foreground' },
      ]
    : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Επισκόπηση platform</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {loadingStats
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
            ))
          : statCards.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value.toLocaleString('el-GR')}</p>
              </div>
            ))}
      </div>

      {/* Member growth chart */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold text-foreground">Εγγραφές (τελευταίοι 12 μήνες)</h2>
        {loadingGrowth ? (
          <div className="h-48 animate-pulse rounded-xl bg-muted" />
        ) : growth && growth.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Εγγραφές" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Δεν υπάρχουν δεδομένα ακόμα</p>
        )}
      </div>
    </div>
  )
}
