'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { useState } from 'react'

const quickLinks = [
  { label: 'Home',         href: '/' },
  { label: 'Properties',   href: '/properties' },
  { label: 'Projects',     href: '/projects' },
  { label: 'Gallery',      href: '/gallery' },
  { label: 'About Us',     href: '/about' },
  { label: 'Contact Us',   href: '/contact' },
]

const companyLinks = [
  { label: 'Our Team',         href: '/team' },
  { label: 'Our Agents',       href: '/agents' },
  { label: 'Plant & Equipment',href: '/equipment' },
  { label: 'Paving Blocks',    href: '/services/paving' },
  { label: 'Construction',     href: '/services/construction' },
  { label: 'Commercial',       href: '/services/commercial' },
]

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'

const socialLinks = [
  { Icon: Facebook,  href: '#',                                            color: 'hover:bg-[#1877F2] hover:border-[#1877F2]' },
  { Icon: Instagram, href: 'https://www.instagram.com/kifarurealestate/', color: 'hover:bg-[#E1306C] hover:border-[#E1306C]' },
  { Icon: Twitter,   href: '#',                                            color: 'hover:bg-[#1DA1F2] hover:border-[#1DA1F2]' },
  { Icon: Youtube,   href: '#',                                            color: 'hover:bg-[#FF0000] hover:border-[#FF0000]' },
]

export default function Footer() {
  const [logoError, setLogoError] = useState(false)

  return (
    <footer className="bg-brand-navy text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-14 h-14 bg-white rounded-sm p-1 flex-shrink-0">
                {!logoError ? (
                  <Image src={`${API}/uploads/logo.png`} alt="Kifaru" fill
                    className="object-contain p-0.5" onError={() => setLogoError(true)} />
                ) : (
                  <div className="w-full h-full bg-brand-red rounded-sm flex items-center justify-center">
                    <span className="text-white font-heading font-bold text-2xl">K</span>
                  </div>
                )}
              </div>
              <div>
                <div className="font-heading font-bold text-white text-lg leading-tight">KIFARU</div>
                <div className="text-red-300 text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5">Real Estate & Building</div>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Tunajenga kwa gharama nafuu. Tanzania's trusted CRB Class 5 registered construction and real estate company since 2007.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ Icon, href, color }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-200 ${color}`}>
                  <Icon size={14} className="text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-5 pb-2 border-b border-white/10">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-yellow-300 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-brand-red rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-5 pb-2 border-b border-white/10">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-yellow-300 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-brand-red rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-5 pb-2 border-b border-white/10">Contact Us</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-brand-red mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400 leading-relaxed">P.O. Box 19614, Ubungo, Goba<br />Njia Nne — Dar es Salaam</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-brand-red flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <a href="tel:+255714940231" className="hover:text-yellow-300 transition-colors block">+255 714 940 231</a>
                  <a href="tel:+255713860510" className="hover:text-yellow-300 transition-colors block">+255 713 860 510</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-brand-red flex-shrink-0" />
                <a href="mailto:kifarurealestate22@gmail.com" className="text-sm text-gray-400 hover:text-yellow-300 transition-colors">
                  kifarurealestate22@gmail.com
                </a>
              </li>
            </ul>
            <div className="bg-white/5 border border-white/10 rounded-sm p-4">
              <p className="text-xs text-yellow-300 font-bold uppercase tracking-widest mb-2">Business Hours</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-400"><span>Mon – Fri</span><span className="text-white">8:00 – 18:00</span></div>
                <div className="flex justify-between text-gray-400"><span>Saturday</span><span className="text-white">9:00 – 16:00</span></div>
                <div className="flex justify-between text-gray-400"><span>Sunday</span><span className="text-gray-600">By Appointment</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal strip */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-center sm:text-left">
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} Kifaru Building Company Limited.</p>
            <p className="text-xs text-gray-600">CRB Reg: B5/1691/11/2023 · TIN: 106-957-053 · VAT: 40-045251-B</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/terms"   className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/admin"   className="text-xs text-brand-red hover:text-red-400 transition-colors font-medium">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}