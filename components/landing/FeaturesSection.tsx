'use client'

import { motion } from 'framer-motion'
import { Users, Briefcase, Handshake, Calendar, Camera, UsersRound } from 'lucide-react'

interface FeatureItem {
  title: string
  description: string
}

interface FeaturesSectionProps {
  t: {
    title: string
    subtitle: string
    directory: FeatureItem
    jobs: FeatureItem
    mentorship: FeatureItem
    events: FeatureItem
    gallery: FeatureItem
    groups: FeatureItem
  }
}

const featureMeta = [
  { key: 'directory', Icon: Users },
  { key: 'jobs', Icon: Briefcase },
  { key: 'mentorship', Icon: Handshake },
  { key: 'events', Icon: Calendar },
  { key: 'gallery', Icon: Camera },
  { key: 'groups', Icon: UsersRound },
] as const

export default function FeaturesSection({ t }: FeaturesSectionProps) {
  const items = [t.directory, t.jobs, t.mentorship, t.events, t.gallery, t.groups]

  return (
    <section id="platform" className="bg-[#050D1A] landing-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2
            className="text-white font-extrabold leading-tight mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {t.title}
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">{t.subtitle}</p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureMeta.map(({ key, Icon }, i) => {
            const item = items[i]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group glass-card rounded-2xl p-6 relative overflow-hidden hover:border-[#E8B931]/30 transition-colors duration-300 cursor-default"
              >
                {/* Gold glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl bg-gradient-to-br from-[#E8B931]/5 to-transparent" />

                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#E8B931]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E8B931]/20 transition-colors duration-200">
                    <Icon size={20} className="text-[#E8B931]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1">{item!.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{item!.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
