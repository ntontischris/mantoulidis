'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface CTASectionProps {
  locale: string
  t: {
    title: string
    subtitle: string
    button: string
  }
}

export default function CTASection({ locale, t }: CTASectionProps) {
  return (
    <section className="bg-[#0A1628] landing-section relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-30%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#E8B931]/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          {/* Decorative top line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#E8B931]/50" />
            <div className="w-2 h-2 rounded-full bg-[#E8B931]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#E8B931]/50" />
          </div>

          <h2
            className="text-white font-extrabold leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {t.title}
          </h2>

          <p className="text-white/55 text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            {t.subtitle}
          </p>

          {/* Animated border button */}
          <div className="inline-block relative group">
            {/* Animated glow ring */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#E8B931] via-[#F5D068] to-[#C99E28] opacity-60 blur-sm group-hover:opacity-90 transition-opacity duration-300 animate-pulse-glow" />

            <Link
              href={`/${locale}/login`}
              className="relative flex items-center gap-3 bg-[#E8B931] hover:bg-[#F5D068] text-[#050D1A] font-bold text-base sm:text-lg px-10 py-5 rounded-xl transition-all duration-200 group-hover:scale-105 active:scale-95"
            >
              {t.button}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
