'use client'

import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

interface LandingFooterProps {
  locale: string
  navT: {
    home: string
    about: string
    activities: string
    platform: string
    contact: string
    login: string
  }
  t: {
    tagline: string
    linksTitle: string
    contactTitle: string
    addressTitle: string
    email: string
    phone: string
    secretary: string
    address1: string
    address2: string
    address1Label: string
    address2Label: string
    copyright: string
    poweredBy: string
  }
}

export default function LandingFooter({ locale, navT, t }: LandingFooterProps) {
  const year = new Date().getFullYear()

  const navLinks = [
    { href: '#hero', label: navT.home },
    { href: '#about', label: navT.about },
    { href: '#activities', label: navT.activities },
    { href: '#platform', label: navT.platform },
    { href: '#contact', label: navT.contact },
    { href: `/${locale}/login`, label: navT.login },
  ]

  return (
    <footer id="contact" className="bg-[#050D1A] border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo + tagline + social */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#E8B931] flex items-center justify-center font-extrabold text-[#050D1A] text-lg">
                M
              </div>
              <span className="font-bold text-white text-sm leading-tight">
                Alumni<br />
                <span className="text-[#E8B931]">Μαντουλίδη</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-[200px]">
              {t.tagline}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/alumni.mandoulides/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">
              {t.linksTitle}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/45 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">
              {t.contactTitle}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-[#E8B931] mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${t.email}`}
                  className="text-white/45 hover:text-white text-sm transition-colors"
                >
                  {t.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-[#E8B931] mt-0.5 flex-shrink-0" />
                <a
                  href={`tel:${t.phone.replace(/\s/g, '')}`}
                  className="text-white/45 hover:text-white text-sm transition-colors"
                >
                  {t.phone}
                </a>
              </li>
              <li className="text-white/35 text-sm">{t.secretary}</li>
            </ul>
          </div>

          {/* Column 4: Addresses */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">
              {t.addressTitle}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#E8B931] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white/60 text-xs font-medium mb-1">{t.address1Label}</div>
                  <div className="text-white/40 text-sm leading-relaxed">{t.address1}</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#E8B931] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white/60 text-xs font-medium mb-1">{t.address2Label}</div>
                  <div className="text-white/40 text-sm leading-relaxed">{t.address2}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs text-center sm:text-left">
            {t.copyright.replace('{year}', String(year))}
          </p>
          <p className="text-white/20 text-xs">{t.poweredBy}</p>
        </div>
      </div>
    </footer>
  )
}
