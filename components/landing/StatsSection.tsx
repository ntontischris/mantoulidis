'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface StatItem {
  value: string
  label: string
}

interface StatsSectionProps {
  t: {
    members: StatItem
    years: StatItem
    events: StatItem
    businesses: StatItem
  }
}

function parseNumeric(val: string): { num: number; suffix: string } {
  const match = val.match(/^(\d+)(.*)$/)
  if (!match) return { num: 0, suffix: val }
  return { num: parseInt(match[1]!, 10), suffix: match[2] ?? '' }
}

function CountUp({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const frame = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(frame)
      else setCount(target)
    }
    requestAnimationFrame(frame)
  }, [inView, target, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  )
}

export default function StatsSection({ t }: StatsSectionProps) {
  const stats = [t.members, t.years, t.events, t.businesses]

  return (
    <section className="bg-[#0A1628] border-y border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {stats.map((stat, i) => {
            const { num, suffix } = parseNumeric(stat.value)
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`flex flex-col items-center py-8 px-4 text-center relative ${
                  i < stats.length - 1 ? 'after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-px after:bg-white/10 after:hidden md:after:block' : ''
                }`}
              >
                <div
                  className="text-[#E8B931] font-extrabold mb-2 tabular-nums"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
                >
                  <CountUp target={num} suffix={suffix} />
                </div>
                <div className="text-white/50 text-sm font-medium uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
