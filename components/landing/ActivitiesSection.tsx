'use client'

import { motion } from 'framer-motion'
import { Trophy, Palette, Globe, BookOpen } from 'lucide-react'

interface ActivityItem {
  title: string
  description: string
}

interface ActivitiesSectionProps {
  t: {
    title: string
    subtitle: string
    sports: ActivityItem
    culture: ActivityItem
    europe: ActivityItem
    academic: ActivityItem
  }
}

const activities = [
  {
    key: 'sports',
    Icon: Trophy,
    glowColor: 'rgba(59,130,246,0.3)',
    borderColor: 'rgba(59,130,246,0.2)',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
  },
  {
    key: 'culture',
    Icon: Palette,
    glowColor: 'rgba(232,185,49,0.3)',
    borderColor: 'rgba(232,185,49,0.2)',
    iconBg: 'bg-[#E8B931]/15',
    iconColor: 'text-[#E8B931]',
  },
  {
    key: 'europe',
    Icon: Globe,
    glowColor: 'rgba(34,197,94,0.3)',
    borderColor: 'rgba(34,197,94,0.2)',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
  },
  {
    key: 'academic',
    Icon: BookOpen,
    glowColor: 'rgba(168,85,247,0.3)',
    borderColor: 'rgba(168,85,247,0.2)',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
  },
] as const

export default function ActivitiesSection({ t }: ActivitiesSectionProps) {
  const items = [t.sports, t.culture, t.europe, t.academic]

  return (
    <section id="activities" className="bg-[#0A1628] landing-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#E8B931] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            {t.subtitle}
          </span>
          <h2
            className="text-white font-extrabold leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {t.title}
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map(({ key, Icon, glowColor, borderColor, iconBg, iconColor }, i) => {
            const item = items[i]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative glass-card rounded-2xl p-7 group cursor-default overflow-hidden"
                style={{ borderColor }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor} 0%, transparent 70%)` }}
                />

                <div className={`relative z-10 w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={28} className={iconColor} />
                </div>

                <h3 className="relative z-10 text-white font-bold text-lg mb-2">{item!.title}</h3>
                <p className="relative z-10 text-white/50 text-sm leading-relaxed">{item!.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
