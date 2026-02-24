'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

interface AboutSectionProps {
  t: {
    eyebrow: string
    title: string
    p1: string
    p2: string
    quote1: string
    quote2: string
  }
}

export default function AboutSection({ t }: AboutSectionProps) {
  return (
    <section id="about" className="bg-[#050D1A] landing-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="inline-block text-[#E8B931] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              {t.eyebrow}
            </span>
            <h2
              className="text-white font-extrabold mb-6 leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
            >
              {t.title}
            </h2>
            <div className="space-y-4">
              <p className="text-white/60 leading-relaxed text-base">{t.p1}</p>
              <p className="text-white/60 leading-relaxed text-base">{t.p2}</p>
            </div>

            {/* Second quote badge */}
            <div className="mt-8 inline-flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-5 py-3">
              <span className="text-[#E8B931] text-lg">&ldquo;</span>
              <span className="text-white/80 text-sm italic font-medium">{t.quote2}</span>
            </div>
          </motion.div>

          {/* Right column — pull quote */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
          >
            <div className="glass-card rounded-2xl p-8 md:p-10 relative overflow-hidden">
              {/* Gold accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E8B931] via-[#F5D068] to-transparent" />

              <Quote size={48} className="text-[#E8B931]/20 mb-6" />

              <blockquote
                className="text-white font-bold leading-tight mb-6"
                style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}
              >
                &ldquo;{t.quote1}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 mt-auto">
                <div className="w-8 h-px bg-[#E8B931]" />
                <span className="text-white/40 text-sm">Σύλλογος Αποφοίτων Μαντουλίδη</span>
              </div>

              {/* Decorative background glow */}
              <div className="absolute bottom-[-40px] right-[-40px] w-40 h-40 rounded-full bg-[#E8B931]/5 blur-[60px] pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
