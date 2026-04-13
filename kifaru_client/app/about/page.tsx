'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, MapPin, Image as ImageIcon, ZoomIn, X, Award, Users, Wrench, TrendingUp } from 'lucide-react'
import { getCertificates } from '@/lib/api'

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'

// Default certificate placeholders shown before/if DB is empty
const defaultCerts = [
  { _id: 'c1', label: 'CRB Certificate',      detail: 'B5/1691/11/2023', sub: 'Class 5 Building Works — Local Category', image: '' },
  { _id: 'c2', label: 'Company Registration',  detail: 'No. 58147',       sub: 'Registered Nov 2023',                      image: '' },
  { _id: 'c3', label: 'TIN Registration',      detail: '106-957-053',     sub: 'Tanzania Revenue Authority',               image: '' },
  { _id: 'c4', label: 'VAT Registration',      detail: '40-045251-B',     sub: 'VAT Registered Feb 2022',                  image: '' },
]

export default function AboutPage() {
  const [certs,    setCerts]    = useState<any[]>(defaultCerts)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    getCertificates()
      .then(d => { if (Array.isArray(d) && d.length > 0) setCerts(d) })
      .catch(() => {})
  }, [])

  return (
    <div>

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0">
          <img src={`${API}/uploads/house_aerial1.jpg`} alt="About" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-brand-navy/85" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <p className="section-subtitle-gold">About Kifaru</p>
          <h1 className="font-heading text-5xl font-bold text-white mb-4">Building Tanzania's Future</h1>
          <div className="w-14 h-0.5 bg-brand-red mb-6" />
          <p className="text-gray-300 max-w-2xl text-lg leading-relaxed">
            Trusted CRB Class 5 registered contractor operating since 2007. From building materials to full-scale real estate and construction services.
          </p>
        </div>
      </section>

      {/* ─── COMPANY STATEMENT ──────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-white"
        style={{ borderTop: '4px solid #B41414' }}
      >
        {/* Ghost watermark */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) rotate(-6deg)',
            fontSize: 'clamp(100px, 20vw, 260px)',
            fontFamily: 'Georgia, serif',
            fontWeight: 900,
            color: 'rgba(10,20,60,0.028)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            letterSpacing: '-0.04em',
            pointerEvents: 'none',
            lineHeight: 1,
          }}
        >
          KIFARU
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>

          {/* LEFT — statement text */}
          <div style={{
            padding: 'clamp(56px,9vw,112px) clamp(24px,7vw,88px) clamp(56px,9vw,112px) clamp(24px,6vw,72px)',
            position: 'relative', zIndex: 1,
          }}>

            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.25rem' }}>
              <div style={{ width: '36px', height: '2px', background: '#B41414' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#B41414' }}>
                Company Statement
              </span>
            </div>

            {/* Large serif lead */}
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(22px, 3.2vw, 40px)',
              lineHeight: 1.35,
              color: '#0A1432',
              fontWeight: 400,
              maxWidth: '700px',
              marginBottom: '2rem',
            }}>
              Kifaru Building Company stands as a{' '}
              <em style={{ color: '#B41414' }}>beacon of excellence</em>{' '}
              in the Tanzanian construction industry, dedicated to delivering superior quality in building and real estate services.
            </p>

            {/* Gold accent rule */}
            <div style={{ width: '56px', height: '2px', background: '#C8A03C', marginBottom: '2rem' }} />

            {/* Body copy */}
            <div style={{ maxWidth: '620px' }}>
              <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#4B5563', marginBottom: '1.1rem' }}>
                Our commitment to innovation, integrity, and customer satisfaction drives us to consistently exceed
                expectations. We pride ourselves on our ability to undertake diverse projects — from residential to
                commercial and industrial — with a focus on providing{' '}
                <strong style={{ color: '#0A1432', fontWeight: 600 }}>sustainable and cost-effective solutions</strong>.
              </p>
              <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#4B5563' }}>
                Our strategic approach to construction, combined with our expert team and modern equipment, ensures we
                remain at the forefront of the industry — delivering results that not only meet but{' '}
                <strong style={{ color: '#0A1432', fontWeight: 600 }}>surpass our clients' needs</strong>.
              </p>
            </div>

            {/* Stat strip */}
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              marginTop: '3.5rem',
              borderTop: '1px solid #E5E7EB',
              paddingTop: '2.25rem',
            }}>
              {[
                { num: '17+', label: 'Years of excellence' },
                { num: '4',   label: 'Cities served' },
                { num: '50+', label: 'Projects delivered' },
                { num: '200+',label: 'Happy clients' },
              ].map(({ num, label }, i, arr) => (
                <div key={label} style={{
                  paddingRight: '2.5rem',
                  marginRight: '2.5rem',
                  marginBottom: '1rem',
                  borderRight: i < arr.length - 1 ? '1px solid #E5E7EB' : 'none',
                }}>
                  <p style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '2.1rem', fontWeight: 700,
                    color: '#B41414', lineHeight: 1, marginBottom: '4px',
                  }}>{num}</p>
                  <p style={{
                    fontSize: '11px', textTransform: 'uppercase',
                    letterSpacing: '0.15em', color: '#6B7280', fontWeight: 600,
                  }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — navy credential panel */}
          <div style={{
            width: 'clamp(200px, 24vw, 340px)',
            background: '#0A1432',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '3rem 2.5rem',
          }}>
            {/* Decorative rings */}
            <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'280px', height:'280px', borderRadius:'50%', border:'1px solid rgba(200,160,60,0.15)' }} />
            <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'160px', height:'160px', borderRadius:'50%', border:'1px solid rgba(200,160,60,0.28)' }} />
            <div style={{ position:'absolute', bottom:'28%', left:'-28px', width:'80px', height:'80px', background:'rgba(180,20,20,0.18)', transform:'rotate(45deg)' }} />

            {/* Content */}
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ width:'32px', height:'3px', background:'#C8A03C', marginBottom:'1.5rem' }} />
              <p style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'#C8A03C', marginBottom:'6px' }}>
                CRB Registered
              </p>
              <p style={{ fontFamily:'Georgia, serif', fontSize:'1.3rem', color:'white', fontWeight:400, lineHeight:1.45, marginBottom:'6px' }}>
                Class 5<br />Building Works
              </p>
              <p style={{ fontSize:'11px', color:'rgba(200,210,230,0.45)', lineHeight:1.6 }}>
                Local Category<br />No. B5/1691/11/2023
              </p>
              <div style={{ marginTop:'2.5rem', borderTop:'1px solid rgba(255,255,255,0.09)', paddingTop:'2rem' }}>
                <p style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'#C8A03C', marginBottom:'6px' }}>
                  Established
                </p>
                <p style={{ fontFamily:'Georgia, serif', fontSize:'3.25rem', color:'white', fontWeight:700, lineHeight:1 }}>
                  2007
                </p>
                <p style={{ fontSize:'11px', color:'rgba(200,210,230,0.45)', marginTop:'6px' }}>
                  Dar es Salaam, Tanzania
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── OUR STORY ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="section-subtitle">Our Story</p>
              <h2 className="section-title mb-6">From Building Materials to Full Real Estate</h2>
              <div className="space-y-5 text-gray-600 text-sm leading-relaxed">
                <p>Incorporated in <strong className="text-brand-navy">2007</strong>, Kifaru Building Company Limited began as a producer and supplier of building materials — blocks, paving and kerbstones. Our early motto, <em className="text-brand-red">"Build Your Dream House, Payment Afterwards,"</em> reflected our commitment to providing accessible housing solutions from day one.</p>
                <p>By <strong className="text-brand-navy">2009</strong>, we expanded into real estate, constructing and selling residential properties across Dar es Salaam, Dodoma, Arusha and Morogoro. Our growth has been driven by a deep commitment to quality and innovation, supported by our extensive expertise, well-trained personnel, and advanced equipment.</p>
                <p>In <strong className="text-brand-navy">2023</strong>, we registered as a Class 5 Building Contractor in the Local Category with the CRB (Registration No. B5/1691/11/2023), further expanding into full building contracting and landscape services — handling projects of every scale, from small residential builds to large commercial and industrial structures.</p>
                <p>Today, Kifaru is a prominent player in Tanzania's construction and real estate sectors. We continue to invest in modern business practices and management techniques to remain at the forefront of the construction industry and new technology.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { num: '17+', label: 'Years Experience' },
                { num: '50+', label: 'Projects Completed' },
                { num: '3',   label: 'City Offices' },
                { num: '200+',label: 'Happy Clients' },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-sm p-10 text-center hover:shadow-md transition-shadow">
                  <p className="font-heading text-5xl font-bold text-brand-red">{s.num}</p>
                  <p className="text-sm text-gray-500 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MISSION / VISION / MOTTO ───────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Mission', text: 'To deliver efficient, high-quality, timely and innovative construction services at international standards, and to provide sustainable, affordable accommodations through effective real estate investment.' },
              { title: 'Vision',  text: 'To be a centre of excellence in high-quality construction services, consistently exceeding client expectations and setting new standards in the Tanzanian construction industry.' },
              { title: 'Motto',   text: '"Tunajenga kwa gharama nafuu" — We build at affordable prices. Our ambition has always been to deliver quality projects at the lowest possible cost, keeping value for money at the heart of everything we do.' },
            ].map(item => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-sm p-10 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-0.5 bg-brand-red mx-auto mb-5" />
                <h3 className="font-heading font-bold text-brand-navy text-xl mb-5">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES ───────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subtitle">What Sets Us Apart</p>
            <h2 className="section-title">Our Capabilities & Approach</h2>
            <div className="gold-line mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: Users,      title: 'Skilled Workforce',   desc: 'Our company prides itself on a knowledgeable and well-trained team with a wealth of hands-on project experience across diverse construction environments.' },
              { Icon: Wrench,     title: 'Advanced Equipment',  desc: 'We are equipped with state-of-the-art machinery and tools, ensuring high-quality results are delivered consistently on every project we undertake.' },
              { Icon: Award,      title: 'All Project Scales',  desc: 'From small residential buildings to large commercial and industrial structures, our well-organised team is ready to handle projects of any complexity or size.' },
              { Icon: TrendingUp, title: 'Repeat Client Trust', desc: 'The majority of our workload comes from tenders, re-appointments and existing projects — a testament to our reputation for quality and client satisfaction.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="bg-gray-50 border border-gray-100 rounded-sm p-7 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-brand-red/10 rounded-sm flex items-center justify-center mb-5">
                  <Icon size={20} className="text-brand-red" />
                </div>
                <h4 className="font-heading font-bold text-brand-navy text-sm mb-3">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 border-l-4 border-brand-red bg-gray-50 rounded-sm p-10">
            <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
              <span className="text-brand-navy font-semibold">Our business philosophy: </span>
              We continue to build our company's reputation and honour while remaining sharply focused on delivering projects in an innovative mode of conduct. Our goal has always been to deliver quality products at the lowest cost possible, while maintaining true value for money for our clients.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CORE VALUES ────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subtitle">What Drives Us</p>
            <h2 className="section-title">Our Core Values</h2>
            <div className="gold-line mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { title: 'Integrity',      desc: 'We conduct business with the highest standards of ethics, honesty and transparency.' },
              { title: 'Quality',        desc: 'Committed to delivering superior quality in every project and service, without compromise.' },
              { title: 'Innovation',     desc: 'Continuously seeking new solutions to meet the evolving needs of our clients.' },
              { title: 'Customer Focus', desc: "Our clients' needs come first — we strive to exceed expectations every time." },
              { title: 'Sustainability', desc: 'Dedicated to sustainable practices that benefit the environment and communities.' },
              { title: 'Teamwork',       desc: 'We believe in collaboration and foster a supportive, inclusive work environment.' },
            ].map(v => (
              <div key={v.title} className="bg-white border border-gray-100 border-l-4 border-l-brand-red rounded-sm p-6 hover:shadow-md transition-shadow">
                <CheckCircle size={16} className="text-brand-gold mb-3" />
                <h4 className="font-heading font-semibold text-brand-navy text-sm mb-2">{v.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LEGAL & COMPLIANCE — loads from DB ─────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subtitle">Legal & Compliance</p>
            <h2 className="section-title">Fully Registered & Compliant</h2>
            <div className="gold-line mx-auto" />
            <p className="text-sm text-gray-400 mt-2">
              Certificate images can be uploaded via{' '}
              <Link href="/admin" className="text-brand-red hover:underline">Admin → Certificates</Link>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certs.map(cert => {
              const imgUrl = cert.image
                ? (cert.image.startsWith('http') ? cert.image : `${API}/uploads/${cert.image}`)
                : null

              return (
                <div key={cert._id} className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">

                  {/* Certificate image area */}
                  {imgUrl ? (
                    <div
                      className="h-48 relative overflow-hidden cursor-pointer group"
                      onClick={() => setLightbox(imgUrl)}
                    >
                      <img
                        src={imgUrl}
                        alt={cert.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ) : (
                    /* Placeholder — no image uploaded yet */
                    <div className="h-48 bg-gray-100 border-b border-gray-100 flex flex-col items-center justify-center gap-3 relative">
                      <ImageIcon size={32} className="text-gray-300" />
                      <div className="text-center px-4">
                        <p className="text-xs text-gray-400">Certificate image</p>
                        <p className="text-xs text-gray-300 mt-0.5">Upload via Admin Panel</p>
                      </div>
                      <Link href="/admin"
                        className="text-[10px] text-brand-red hover:underline">
                        Upload in Admin →
                      </Link>
                      {/* Corner decorations */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-brand-gold/40" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-brand-gold/40" />
                    </div>
                  )}

                  {/* Certificate details */}
                  <div className="p-6 text-center">
                    <p className="text-xs text-brand-gold font-bold uppercase tracking-widest mb-1">{cert.label}</p>
                    <p className="text-brand-navy font-semibold text-sm mb-0.5">{cert.detail}</p>
                    <p className="text-xs text-gray-400">{cert.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── PLANT & EQUIPMENT ──────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subtitle">Our Capacity</p>
            <h2 className="section-title">Plant & Equipment</h2>
            <div className="gold-line mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { item: 'Tipper Trucks',         qty: '9 vehicles' },
              { item: 'Concrete Mixers',       qty: '2 units' },
              { item: 'Block Making Machines', qty: '8 moulds' },
              { item: 'Air Compressors',       qty: '2 units' },
              { item: 'Generators',            qty: '2 × 5KVA' },
              { item: 'Angle Grinders',        qty: '2 × Makita' },
              { item: 'Toyota Land Cruiser',   qty: '1 vehicle' },
              { item: 'Wood Working Machines', qty: 'Multiple' },
            ].map(e => (
              <div key={e.item} className="bg-white border border-gray-100 rounded-sm p-4 text-center hover:shadow-md transition-shadow">
                <p className="text-brand-gold font-semibold text-sm">{e.item}</p>
                <p className="text-xs text-gray-500 mt-1">{e.qty}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/equipment" className="text-sm text-brand-red hover:underline">
              View full equipment list →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── OFFICES ────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subtitle">Where We Are</p>
            <h2 className="section-title">Our Offices</h2>
            <div className="gold-line mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { city: 'Dar es Salaam', role: 'Head Office',   address: 'P.O. Box 19614, Ubungo, Goba, Njia Nne', main: true  },
              { city: 'Arusha',        role: 'Branch Office', address: 'Arusha Region, Tanzania',                 main: false },
              { city: 'Dodoma',        role: 'Branch Office', address: 'Dodoma Region, Tanzania',                 main: false },
            ].map(o => (
              <div key={o.city} className={`rounded-sm p-9 shadow-sm ${o.main ? 'bg-brand-red text-white' : 'bg-white border border-gray-100'}`}>
                <MapPin size={22} className={`mb-4 ${o.main ? 'text-red-200' : 'text-brand-red'}`} />
                <h3 className={`font-heading font-bold text-2xl mb-1 ${o.main ? 'text-white' : 'text-brand-navy'}`}>{o.city}</h3>
                <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${o.main ? 'text-red-200' : 'text-brand-gold'}`}>{o.role}</p>
                <p className={`text-sm ${o.main ? 'text-red-100' : 'text-gray-500'}`}>{o.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CERTIFICATE LIGHTBOX ───────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
          >
            <X size={20} className="text-white" />
          </button>
          <img
            src={lightbox}
            alt="Certificate"
            className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  )
}