'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  {
    label: 'Services', href: '/services',
    children: [
      { label: 'All Services',             href: '/services' },
      { label: 'Paving Blocks',            href: '/services/paving' },
      { label: 'Residential Construction', href: '/services/construction' },
      { label: 'Commercial Buildings',     href: '/services/commercial' },
    ],
  },
  { label: 'Projects', href: '/projects' },
  { label: 'Gallery',  href: '/gallery' },
  {
    label: 'Company', href: '/about',
    children: [
      { label: 'About Us',         href: '/about' },
      { label: 'Our Team',         href: '/team' },
      { label: 'Our Agents',       href: '/agents' },
      { label: 'Plant & Equipment',href: '/equipment' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'

export default function Navbar() {
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Top strip */}
      <div className="bg-brand-red text-white text-xs py-2 px-4 hidden md:flex items-center justify-between">
        <span className="text-red-100 font-medium">Tunajenga kwa gharama nafuu — Building dreams across Tanzania since 2007</span>
        <div className="flex items-center gap-5">
          <a href="tel:+255714940231" className="flex items-center gap-1.5 hover:text-red-200 transition-colors font-semibold">
            <Phone size={11} />+255 714 940 231
          </a>
          <span className="text-red-300">|</span>
          <a href="mailto:kifarurealestate22@gmail.com" className="hover:text-red-200 transition-colors">
            kifarurealestate22@gmail.com
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`sticky top-0 z-50 bg-brand-navy transition-all duration-300 ${
        scrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.25)]' : 'border-b border-blue-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="relative w-14 h-14 flex-shrink-0 bg-white rounded-sm p-1">
                {!logoError ? (
                  <Image src={`${API}/uploads/logo.png`} alt="Kifaru Real Estate" fill
                    className="object-contain p-1" onError={() => setLogoError(true)} priority />
                ) : (
                  <div className="w-full h-full bg-brand-red rounded-sm flex items-center justify-center">
                    <span className="text-white font-heading font-bold text-2xl">K</span>
                  </div>
                )}
              </div>
              <div className="hidden sm:block">
                <div className="font-heading font-bold text-white text-lg leading-tight tracking-wider">KIFARU</div>
                <div className="text-red-300 text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5">Real Estate & Building</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative group">
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-200 hover:text-white rounded-sm hover:bg-white/10 transition-all tracking-wide">
                      {link.label}
                      <ChevronDown size={11} className="group-hover:rotate-180 transition-transform duration-200 opacity-60" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-100 rounded-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                      {link.children.map((c, i) => (
                        <Link key={c.href} href={c.href}
                          className={`block px-4 py-3 text-sm transition-colors border-b border-gray-50 last:border-0 ${i === 0 ? 'text-brand-red font-semibold hover:bg-red-50' : 'text-gray-700 hover:text-brand-navy hover:bg-gray-50'}`}>
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href}
                    className="px-3 py-2 text-sm font-medium text-blue-200 hover:text-white rounded-sm hover:bg-white/10 transition-all tracking-wide">
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/contact" className="btn-primary text-xs py-2.5 px-5">Book Consultation</Link>
              {/* <Link href="/admin" className="border border-white/20 text-blue-300 hover:text-white hover:border-white/40 text-xs font-semibold px-4 py-2.5 rounded-sm transition-all">
                Admin
              </Link> */}
            </div>

            {/* Mobile toggle */}
            <button className="lg:hidden p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-blue-900 bg-brand-navy">
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link href={link.href}
                    className="block py-3 px-4 text-sm font-medium text-blue-200 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
                    onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="ml-6 pl-3 border-l border-white/10 mb-1">
                      {link.children.slice(1).map((c) => (
                        <Link key={c.href} href={c.href}
                          className="block py-2 text-xs text-blue-300 hover:text-white transition-colors"
                          onClick={() => setMenuOpen(false)}>
                          — {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
                <Link href="/contact" className="btn-primary w-full text-center text-xs py-3" onClick={() => setMenuOpen(false)}>
                  Book Consultation
                </Link>
                <Link href="/admin" className="block border border-white/20 text-blue-300 text-xs font-semibold px-4 py-3 rounded-sm text-center hover:bg-white/10 transition-all" onClick={() => setMenuOpen(false)}>
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
