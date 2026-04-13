'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Search, Home, Building2, TreePine, TrendingUp, Shield, Users, Star,
  ArrowRight, MapPin, Phone, CheckCircle, Play, Pause, ChevronRight, Volume2, VolumeX
} from 'lucide-react'
import PropertyCard, { Property } from '@/components/ui/PropertyCard'
import BookingForm from '@/components/ui/BookingForm'
import { getProperties, getTestimonials, getProjects } from '@/lib/api'

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'

const categories = [
  { icon: Home,       label: 'Houses',       href: '/properties?type=house',      sub: 'For Sale & Rent' },
  { icon: Building2,  label: 'Apartments',   href: '/properties?type=apartment',  sub: 'City Living' },
  { icon: TreePine,   label: 'Land & Plots', href: '/properties?type=land',       sub: 'Build Your Own' },
  { icon: TrendingUp, label: 'Commercial',   href: '/properties?type=commercial', sub: 'Investment Grade' },
]

const whyUs = [
  { icon: Shield,     title: 'CRB Registered',  desc: "Class 5 building contractor registered with Tanzania's Contractor Registration Board since 2007." },
  { icon: Users,      title: 'Expert Team',      desc: 'Architects, civil engineers, surveyors and certified tradespeople on every project.' },
  { icon: TrendingUp, title: 'Honest Prices',    desc: 'Build your dream home at transparent prices. Pay only after handover — no upfront risk.' },
  { icon: Star,       title: 'Full Support',     desc: 'From first consultation to final handover — we guide you every step of the way.' },
]

export default function HomePage() {
  const [properties,       setProperties]       = useState<Property[]>([])
  const [testimonials,     setTestimonials]     = useState<any[]>([])
  const [projects,         setProjects]         = useState<any[]>([])
  const [videoPlaying,     setVideoPlaying]     = useState(true)
  const [muted,            setMuted]            = useState(true)
  const [searchQ,          setSearchQ]          = useState('')
  const [compVideoPlaying, setCompVideoPlaying] = useState(false)
  const [compMuted,        setCompMuted]        = useState(true)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const compVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    getProperties({ featured: 'true', limit: '6' }).then(d => setProperties(d.properties || [])).catch(() => {})
    getTestimonials().then(d => setTestimonials(Array.isArray(d) ? d.slice(0, 3) : [])).catch(() => {})
    getProjects().then(d => setProjects(Array.isArray(d) ? d.slice(0, 6) : [])).catch(() => {})
  }, [])

  const toggleHeroVideo = () => {
    if (videoRef.current) {
      videoPlaying ? videoRef.current.pause() : videoRef.current.play()
      setVideoPlaying(!videoPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted
      setMuted(!muted)
    }
  }

  const toggleCompVideo = () => {
    if (compVideoRef.current) {
      if (compVideoPlaying) {
        compVideoRef.current.pause()
      } else {
        compVideoRef.current.play()
        compVideoRef.current.muted = compMuted
      }
      setCompVideoPlaying(!compVideoPlaying)
    }
  }

  const toggleCompMute = () => {
    if (compVideoRef.current) {
      compVideoRef.current.muted = !compMuted
      setCompMuted(!compMuted)
    }
  }

  return (
    <div>

      {/* ═══════════════════════════════════════════════════
          HERO — dark navy with background video
      ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-brand-navy">
        {/* Background video */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover opacity-30"
          >
            <source src={`${API}/uploads/sample.mp4`} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/75 to-brand-navy/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent" />
        </div>

        {/* Left red accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red z-10" />

        {/* Hero video controls */}
        <div className="absolute bottom-32 right-6 z-20 flex gap-2">
          <button
            onClick={toggleMute}
            className="w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={13} className="text-white" /> : <Volume2 size={13} className="text-white" />}
          </button>
          <button
            onClick={toggleHeroVideo}
            className="w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all"
            title={videoPlaying ? 'Pause' : 'Play'}
          >
            {videoPlaying ? <Pause size={13} className="text-white" /> : <Play size={13} className="text-white ml-0.5" />}
          </button>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-brand-red/40 bg-brand-red/10 text-red-300 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
              TUNAJENGA KWA GHARAMA NAFUU · MALIPO BAADA YA KUKABIDHIWA NYUMBA YAKO
            </div>

            {/* Headline */}
            <h1 className="font-heading font-bold text-white leading-[1.05] mb-6">
              <span className="text-5xl sm:text-6xl lg:text-7xl block">BUILD YOUR DREAM HOUSE</span>
              <span className="text-brand-red italic font-light tracking-wide text-3xl sm:text-5xl block mt-1">PAY AFTERWARDS</span>
              <span className="text-yellow-300 text-xl sm:text-3xl font-semibold block mt-2 leading-snug">
                MTEJA HUTONUNUA HATA MSUMARI.
              </span>
            </h1>

            <p className="text-blue-200 text-lg leading-relaxed mb-10 max-w-xl">
              Kifaru Building &amp; Real Estate Co. Ltd — delivering quality homes, paving solutions and
              commercial buildings across Tanzania since 2007.
            </p>

            {/* Search bar */}
            <div className="bg-white rounded-sm p-2 flex flex-col sm:flex-row gap-2 mb-6 max-w-xl shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-3">
                <MapPin size={16} className="text-brand-red flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search location or property type..."
                  className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400 py-2"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (window.location.href = `/properties${searchQ ? `?q=${searchQ}` : ''}`)}
                />
              </div>
              <Link href={`/properties${searchQ ? `?q=${searchQ}` : ''}`} className="btn-primary justify-center">
                <Search size={15} /> Search
              </Link>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2">
              {['Houses for Sale', 'Apartments', 'Land & Plots', 'Paving Blocks'].map(tag => (
                <Link key={tag} href={`/properties?q=${encodeURIComponent(tag)}`}
                  className="text-xs text-white/70 border border-white/20 px-3 py-1.5 rounded-sm hover:bg-white/10 hover:text-white transition-all">
                  {tag}
                </Link>
              ))}
              <Link href="/floorplans"
                className="text-xs text-yellow-300/80 border border-yellow-300/30 px-3 py-1.5 rounded-sm hover:bg-yellow-300/10 hover:text-yellow-300 transition-all">
                Floor Plans
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-brand-navy/95 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '17+',  label: 'Years Experience' },
                { value: '19+',  label: 'Projects Completed' },
                { value: '3',    label: 'Cities Covered' },
                { value: '200+', label: 'Happy Clients' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-heading font-bold text-2xl text-white">{s.value}</p>
                  <p className="text-xs text-blue-300 mt-0.5 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          COMPANY VIDEO CARD — white background
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Clickable video card */}
            <div
              className="relative rounded-sm overflow-hidden shadow-xl border border-gray-100 bg-brand-navy group cursor-pointer"
              onClick={toggleCompVideo}
            >
              <video
                ref={compVideoRef}
                className="w-full aspect-video object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                loop
                playsInline
                muted
                onEnded={() => setCompVideoPlaying(false)}
              >
                <source src={`${API}/uploads/sample.mp4`} type="video/mp4" />
              </video>

              {/* Play overlay — shown when paused */}
              {!compVideoPlaying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-navy/50">
                  <div
                    className="flex items-center justify-center bg-brand-red rounded-full shadow-2xl hover:scale-110 transition-transform mb-3"
                    style={{ width: 72, height: 72 }}
                  >
                    <Play size={28} className="text-white ml-1.5" />
                  </div>
                  <p className="text-white font-heading font-semibold text-lg">Watch Our Story</p>
                  <p className="text-blue-200 text-sm mt-1">Tunajenga kwa gharama nafuu</p>
                </div>
              )}

              {/* Bottom label — shown when paused */}
              {!compVideoPlaying && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm px-4 py-2 flex items-center justify-between">
                    <span className="text-white text-xs font-semibold">Kifaru Building Co. Ltd — Company Overview</span>
                    <span className="text-blue-200 text-xs">Click to play</span>
                  </div>
                </div>
              )}

              {/* Controls — shown when playing */}
              {compVideoPlaying && (
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={e => { e.stopPropagation(); toggleCompMute() }}
                    className="w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all"
                    title={compMuted ? 'Unmute' : 'Mute'}
                  >
                    {compMuted ? <VolumeX size={13} className="text-white" /> : <Volume2 size={13} className="text-white" />}
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); toggleCompVideo() }}
                    className="w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Pause size={13} className="text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Company description */}
            <div>
              <p className="section-subtitle">Who We Are</p>
              <h2 className="section-title mb-2">Kifaru Building & Real Estate Company Limited</h2>
              <div className="gold-line" />
              <p className="text-gray-600 leading-relaxed mb-5">
                Founded in 2007, Kifaru Building Company Limited is a CRB Class 4 registered contractor —
                one of Tanzania's most trusted names in residential construction, real estate and paving block supply.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                From our signature{' '}
                <strong className="text-brand-navy">"pay after handover"</strong>{' '}
                model to nationwide paving delivery, we've helped over 200 families and businesses build
                quality properties at affordable prices.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'CRB Class 5 Registered Building Contractor',
                  'VAT & TRA Registered — fully tax compliant',
                  '19+ completed projects across 5 regions',
                  'Modern plant fleet including 9 tipper trucks',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={15} className="text-brand-red flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link href="/about"    className="btn-outline">About Us</Link>
                <Link href="/projects" className="btn-primary">View Projects <ChevronRight size={14} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PROPERTY CATEGORIES — light gray
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-subtitle">Browse By Type</p>
            <h2 className="section-title">Explore Properties</h2>
            <div className="gold-line mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link key={cat.label} href={cat.href}
                className="bg-white border border-gray-100 rounded-sm p-6 text-center group hover:-translate-y-1 hover:shadow-lg hover:border-red-100 transition-all duration-300">
                <div className="w-14 h-14 bg-red-50 rounded-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-red transition-colors">
                  <cat.icon size={24} className="text-brand-red group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading font-semibold text-brand-navy text-base mb-1">{cat.label}</h3>
                <p className="text-xs text-gray-400">{cat.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PROPERTIES — white
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-subtitle">Hand-picked for You</p>
              <h2 className="section-title">Featured Properties</h2>
              <div className="gold-line" />
            </div>
            <Link href="/properties"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:gap-3 transition-all">
              View all <ArrowRight size={15} />
            </Link>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-sm">
              <Building2 size={48} className="mx-auto mb-4 text-gray-200" />
              <p className="text-gray-400 mb-2">Properties will appear here once added via the admin panel.</p>
              <Link href="/admin" className="text-brand-red text-sm hover:underline">Go to Admin →</Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FLOOR PLANS STRIP — brand-navy
      ═══════════════════════════════════════════════════ */}
      <section className="py-12 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-yellow-300 text-xs font-bold uppercase tracking-widest mb-2">House Packages</p>
              <h2 className="font-heading text-2xl font-bold text-white">Browse Ready Floor Plans</h2>
              <p className="text-blue-200 text-sm mt-2">
                2-bedroom to 5-bedroom packages from <strong className="text-white">TZS 28M</strong> — pay after handover.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/floorplans" className="btn-primary">View Floor Plans <ChevronRight size={14} /></Link>
              <Link href="/contact"    className="btn-ghost">Custom Design</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PAVING SECTION — light gray
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-subtitle">Kifaru Paving Blocks</p>
              <h2 className="section-title mb-2">Premium Paving Solutions</h2>
              <div className="gold-line" />
              <p className="text-gray-600 leading-relaxed mb-8">
                We manufacture and supply high-quality paving blocks, kerbstones and interlocking pavers in
                multiple shapes, sizes and colours — suitable for driveways, roads, public plazas and commercial floors.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { title: 'Multiple Shapes',     desc: 'Rectangular, hexagonal, hollow and decorative patterns.' },
                  { title: 'Heavy-Duty Grade',    desc: 'Engineered for high-traffic roads and commercial use.' },
                  { title: 'Nationwide Delivery', desc: 'Our fleet delivers across Dar es Salaam, Arusha and Dodoma.' },
                  { title: 'Full Installation',   desc: 'Professional installation and landscaping service available.' },
                ].map(f => (
                  <div key={f.title} className="bg-white border border-gray-100 rounded-sm p-4 border-l-4 border-l-brand-red shadow-sm">
                    <h4 className="text-brand-navy font-semibold text-sm mb-1">{f.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
              <Link href="/services/paving" className="btn-primary">
                View Paving Products <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 h-56 rounded-sm overflow-hidden shadow-md">
                <img src={`${API}/uploads/paving_grey.jpg`} alt="Grey paving"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="h-44 rounded-sm overflow-hidden shadow-md">
                <img src={`${API}/uploads/paving_red.jpg`} alt="Red paving"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="h-44 rounded-sm overflow-hidden shadow-md">
                <img src={`${API}/uploads/paving_hex.jpg`} alt="Hex paving"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY KIFARU — dark navy
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Stacked images */}
            <div className="relative h-[440px] hidden lg:block">
              <div className="absolute top-0 left-0 w-[68%] h-[70%] rounded-sm overflow-hidden shadow-2xl border-4 border-brand-navy">
                <img src={`${API}/uploads/house_aerial1.jpg`} alt="Construction site"
                  className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-[56%] h-[52%] rounded-sm overflow-hidden shadow-2xl border-4 border-brand-navy">
                <img src={`${API}/uploads/house_modern.jpg`} alt="Modern house"
                  className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-red text-white text-center px-6 py-5 rounded-sm shadow-2xl z-10">
                <p className="font-heading text-3xl font-bold">17+</p>
                <p className="text-xs uppercase tracking-widest text-red-200 mt-0.5">Years Experience</p>
              </div>
            </div>

            <div>
              <p className="section-subtitle-gold">Why Choose Kifaru</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                Tanzania's Most Trusted Building Partner
              </h2>
              <div className="w-12 h-0.5 bg-brand-red mt-3 mb-6" />
              <p className="text-blue-200 leading-relaxed mb-8">
                For over 17 years, Kifaru has been helping Tanzanians build and own quality homes at affordable
                prices. CRB registered, VAT compliant, operating across Dar es Salaam, Arusha and Dodoma.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'CRB Class 5 Registered (B5/1691/11/2023)',
                  'VAT & TRA Registered — fully tax compliant',
                  '19+ completed projects across 5 regions',
                  'Pay after handover — no upfront risk to you',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={15} className="text-yellow-300 flex-shrink-0" />
                    <span className="text-blue-100 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {whyUs.map(item => (
                  <div key={item.title} className="bg-white/5 border border-white/10 rounded-sm p-5 hover:bg-white/10 transition-colors">
                    <div className="w-9 h-9 bg-brand-red/20 rounded-sm flex items-center justify-center mb-3">
                      <item.icon size={17} className="text-red-300" />
                    </div>
                    <h4 className="font-heading font-semibold text-white text-sm mb-1.5">{item.title}</h4>
                    <p className="text-blue-300 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link href="/about"   className="btn-ghost">About Kifaru</Link>
                <Link href="/contact" className="btn-primary">Get In Touch</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          RECENT PROJECTS — light gray
      ═══════════════════════════════════════════════════ */}
      {projects.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-subtitle">Our Portfolio</p>
                <h2 className="section-title">Recent Projects</h2>
                <div className="gold-line" />
              </div>
              <Link href="/projects"
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:gap-3 transition-all">
                All projects <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p: any, i: number) => {
                const fallbacks = [
                  `${API}/uploads/house_aerial1.jpg`,
                  `${API}/uploads/house_aerial2.jpg`,
                  `${API}/uploads/house_modern.jpg`,
                ]
                const imgUrl = p.image
                  ? (p.image.startsWith('http') ? p.image : `${API}/uploads/${p.image}`)
                  : fallbacks[i % 3]
                return (
                  <div key={p._id}
                    className="bg-white border border-gray-100 rounded-sm overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                    <div className="h-48 overflow-hidden">
                      <img src={imgUrl} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-brand-gold font-semibold uppercase tracking-widest mb-1">
                        {p.location} · {p.year}
                      </p>
                      <h3 className="font-heading font-semibold text-brand-navy mb-2 text-sm group-hover:text-brand-red transition-colors">
                        {p.name}
                      </h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-10">
              <Link href="/projects" className="btn-outline">View All 19+ Projects</Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS — white
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Client Reviews</p>
            <h2 className="section-title">What Our Clients Say</h2>
            <div className="gold-line mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(testimonials.length > 0 ? testimonials : [
              { _id: '1', name: 'Fatuma Ally',    role: 'Homeowner, Dar es Salaam', rating: 5, text: 'Kifaru built my dream home in Kigamboni within timeline and budget. The quality is exceptional and the team was professional throughout.' },
              { _id: '2', name: 'Robert Makundi', role: 'Business Owner, Dodoma',   rating: 5, text: 'We used Kifaru for our commercial property in Dodoma. Outstanding from foundation to finishing. Highly recommend!' },
              { _id: '3', name: 'Sarah Kimaro',   role: 'Property Investor, Arusha',rating: 5, text: 'The pay-after-handover model gave me confidence. Excellent paving work and professional service throughout.' },
            ]).map((t: any) => (
              <div key={t._id} className="bg-gray-50 border border-gray-100 rounded-sm p-7 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-navy text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          BOOKING SECTION — light gray
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50" id="booking">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact info */}
            <div>
              <p className="section-subtitle">Get In Touch</p>
              <h2 className="section-title mb-2">Book a Consultation</h2>
              <div className="gold-line" />
              <p className="text-gray-600 leading-relaxed mb-10">
                Whether you're planning a new home, a commercial building or a paving project —
                talk to our experts today.
              </p>
              <div className="space-y-5">
                {[
                  { icon: Phone,  label: 'Phone / WhatsApp', value: '+255 714 940 231  ·  +255 713 860 510' },
                  { icon: MapPin, label: 'Email',             value: 'kifarurealestate22@gmail.com' },
                  { icon: MapPin, label: 'Head Office',       value: 'P.O. Box 19614, Goba, Dar es Salaam' },
                  { icon: MapPin, label: 'Branches',          value: 'Arusha  ·  Dodoma' },
                ].map(c => (
                  <div key={c.label} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-brand-red rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <c.icon size={15} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">{c.label}</p>
                      <p className="text-brand-navy font-medium text-sm">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp shortcut */}
              <a
                href="https://wa.me/255714940231?text=Hello%2C%20I'm%20interested%20in%20Kifaru%20services.%20Please%20contact%20me."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-6 py-3 rounded-sm transition-colors shadow-sm"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat with us on WhatsApp
              </a>
            </div>

            {/* Booking form */}
            <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm">
              <h3 className="font-heading font-bold text-brand-navy text-xl mb-1">Request a Consultation</h3>
              <p className="text-sm text-gray-500 mb-6">Fill in the form and our team will contact you within 24 hours.</p>
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA BANNER — brand-red
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 bg-brand-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your Dream Property?
          </h2>
          <p className="text-red-100 text-base mb-8 max-w-lg mx-auto">
            Free consultation, no obligations. Build your dream — pay afterwards.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-ghost">Book a Free Consultation</Link>
            <a href="tel:+255714940231"
              className="flex items-center gap-2 text-white font-semibold text-sm hover:text-red-200 transition-colors">
              <Phone size={16} /> +255 714 940 231
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}