'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

interface LandingNavProps {
  locale: string
  t: {
    home: string
    about: string
    activities: string
    platform: string
    contact: string
    login: string
  }
}

export default function LandingNav({ locale, t }: LandingNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const otherLocale = locale === 'el' ? 'en' : 'el'
  const otherPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  const links = [
    { href: '#hero', label: t.home },
    { href: '#about', label: t.about },
    { href: '#activities', label: t.activities },
    { href: '#platform', label: t.platform },
    { href: '#contact', label: t.contact },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050D1A]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-[#E8B931] flex items-center justify-center font-extrabold text-[#050D1A] text-lg group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="font-bold text-white text-sm hidden sm:block leading-tight">
              Alumni<br />
              <span className="text-[#E8B931]">Μαντουλίδη</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <Link
              href={otherPath}
              className="text-xs font-medium text-white/60 hover:text-white transition-colors border border-white/20 rounded-md px-2 py-1 hover:border-white/40"
            >
              {otherLocale.toUpperCase()}
            </Link>

            {/* Login CTA */}
            <Link
              href={`/${locale}/login`}
              className="hidden sm:flex items-center gap-1.5 bg-[#E8B931] hover:bg-[#F5D068] text-[#050D1A] font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {t.login}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white/80 hover:text-white p-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#050D1A]/98 border-t border-white/10 pb-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="px-4 pt-3 border-t border-white/10 mt-2">
              <Link
                href={`/${locale}/login`}
                className="flex items-center justify-center bg-[#E8B931] text-[#050D1A] font-semibold text-sm px-4 py-2.5 rounded-lg w-full"
                onClick={() => setMenuOpen(false)}
              >
                {t.login}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
