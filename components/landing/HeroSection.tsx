'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  locale: string
  t: {
    eyebrow: string
    line1: string
    line2: string
    line3: string
    subtitle: string
    cta: string
    ctaSecondary: string
    scrollHint: string
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.65,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
}

export default function HeroSection({ locale, t }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050D1A]"
    >
      {/* Gradient mesh blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] rounded-full bg-blue-600/20 blur-[120px] animate-blob" />
        <div className="absolute top-[10%] right-[-15%] w-[250px] h-[250px] sm:w-[375px] sm:h-[375px] lg:w-[500px] lg:h-[500px] rounded-full bg-[#E8B931]/10 blur-[100px] animate-blob-delay" />
        <div className="absolute bottom-[-10%] left-[20%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] rounded-full bg-indigo-700/15 blur-[90px] animate-blob-delay2" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
        {/* Eyebrow badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-[#E8B931]/10 border border-[#E8B931]/30 text-[#E8B931] text-xs sm:text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8B931] animate-pulse" />
            {t.eyebrow}
          </span>
        </motion.div>

        {/* Headline */}
        <div className="mb-8 space-y-1">
          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-white/70 font-light text-2xl sm:text-3xl md:text-4xl tracking-wide"
          >
            {t.line1}
          </motion.p>

          <motion.h1
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-white font-extrabold leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 9vw, 6.5rem)' }}
          >
            {t.line2}
          </motion.h1>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <span
              className="gradient-text font-extrabold leading-[0.95] tracking-tight block"
              style={{ fontSize: 'clamp(3rem, 9vw, 6.5rem)' }}
            >
              {t.line3}
            </span>
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-white/50 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {t.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={`/${locale}/login`}
            className="group flex items-center gap-2 bg-[#E8B931] hover:bg-[#F5D068] text-[#050D1A] font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-[#E8B931]/20"
          >
            {t.cta}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#about"
            className="flex items-center gap-2 text-white/70 hover:text-white font-medium text-base px-6 py-4 rounded-xl border border-white/15 hover:border-white/30 transition-all duration-200 hover:bg-white/5"
          >
            {t.ctaSecondary}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">{t.scrollHint}</span>
        <ChevronDown
          size={20}
          className="text-white/40 animate-bounce"
        />
      </motion.div>
    </section>
  )
}
