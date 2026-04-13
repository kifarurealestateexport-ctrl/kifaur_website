'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Layers, Building2, TreePine, Zap, Hammer, Home as HomeIcon, ChevronRight } from 'lucide-react'
import { getServices } from '@/lib/api'

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'

// Map category name → icon component
function categoryIcon(category: string) {
  const c = category.toLowerCase()
  if (c.includes('pav'))                       return Layers
  if (c.includes('resid') || c.includes('house')) return HomeIcon
  if (c.includes('commerc'))                   return Building2
  if (c.includes('land') || c.includes('garden')) return TreePine
  if (c.includes('electr'))                    return Zap
  if (c.includes('join') || c.includes('carp')) return Hammer
  return Building2
}

// Map category → detail page href
function categoryHref(category: string) {
  const c = category.toLowerCase()
  if (c.includes('pav'))    return '/services/paving'
  if (c.includes('resid'))  return '/services/construction'
  if (c.includes('commerc'))return '/services/commercial'
  return '/services'
}

// Fallback image per category
function categoryFallback(category: string) {
  const c = category.toLowerCase()
  if (c.includes('pav'))    return 'paving_grey.jpg'
  if (c.includes('resid'))  return 'house_aerial1.jpg'
  if (c.includes('commerc'))return 'house_aerial2.jpg'
  return 'house_modern.jpg'
}

// Default services shown if DB is empty
const DEFAULT_SERVICES = [
  { _id:'d1', category:'Paving & Kerbstones',      name:'Rectangular Paving Blocks', description:'Grey, red and black rectangular pavers for driveways, roads and commercial spaces. Heavy-duty strength, CRB approved.',  images:['paving_grey.jpg'] },
  { _id:'d2', category:'Paving & Kerbstones',      name:'Hexagonal Paving Blocks',   description:'Distinctive hexagonal pavers in dark grey and black. Ideal for decorative areas, garden paths and public spaces.',       images:['paving_hex.jpg']  },
  { _id:'d3', category:'Paving & Kerbstones',      name:'Square & Flat Pavers',      description:'Smooth-faced square pavers in red, terracotta, grey and white. Popular for courtyards, pool surrounds and patios.',      images:['paving_red.jpg']  },
  { _id:'d4', category:'Residential Construction', name:'Bungalows & Family Homes',  description:'2–5 bedroom residential homes built to your specification. Fixed price, pay after handover.',                           images:['house_aerial1.jpg'] },
  { _id:'d5', category:'Residential Construction', name:'Service Apartments',        description:'Multi-unit apartment blocks for rental income. Full design, build and handover service.',                                  images:['house_aerial2.jpg'] },
  { _id:'d6', category:'Commercial Buildings',     name:'Offices & Hotels',          description:'CRB Class 5 registered for offices, hotels, schools, warehouses and healthcare facilities.',                              images:['house_modern.jpg'] },
  { _id:'d7', category:'Landscaping',              name:'Garden Design & Planting',  description:'Professional garden design, lawn establishment, ornamental planting and walkway construction.',                           images:['house_modern.jpg'] },
  { _id:'d8', category:'Electrical Works',         name:'Electrical Installation',   description:'Full wiring, distribution boards, earthing and solar integration for all building types.',                               images:['house_aerial1.jpg'] },
  { _id:'d9', category:'Joinery & Carpentry',      name:'Doors, Windows & Cabinets', description:'Custom wooden doors, window frames, kitchen cabinets, wardrobes and built-in furniture.',                                images:['house_modern.jpg'] },
]

export default function ServicesPage() {
  const [services,       setServices]       = useState<any[]>(DEFAULT_SERVICES)
  const [activeCategory, setActiveCategory] = useState('All')
  const [usingDB,        setUsingDB]        = useState(false)

  useEffect(() => {
    getServices()
      .then(d => {
        if (Array.isArray(d) && d.length > 0) {
          setServices(d)
          setUsingDB(true)
        }
      })
      .catch(() => {})
  }, [])

  // Group services by category
  const grouped = services.reduce((acc: Record<string, any[]>, s) => {
    const cat = s.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})

  const categories    = ['All', ...Object.keys(grouped)]
  const visibleGroups = activeCategory === 'All'
    ? grouped
    : { [activeCategory]: grouped[activeCategory] || [] }

  return (
    <div>
      {/* Hero */}
      <section className="page-hero text-center">
        <div className="max-w-3xl mx-auto">
          <p className="section-subtitle-gold">What We Offer</p>
          <h1 className="font-heading text-5xl font-bold text-white mb-4">Our Services</h1>
          <div className="w-14 h-0.5 bg-brand-red mx-auto mb-6" />
          <p className="text-blue-200 text-lg leading-relaxed">
            From high-quality paving blocks to full-scale residential and commercial construction — Kifaru Building Company is your one-stop partner in Tanzania.
          </p>
        </div>
      </section>

      {/* Category filter tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map(cat => {
              const Icon = cat === 'All' ? Building2 : categoryIcon(cat)
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    activeCategory === cat
                      ? 'bg-brand-navy text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}>
                  <Icon size={13} />
                  {cat}
                  {cat !== 'All' && grouped[cat] && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeCategory === cat ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {grouped[cat].length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Services grouped by category */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {Object.entries(visibleGroups).map(([category, items]) => {
            const Icon = categoryIcon(category)
            const href = categoryHref(category)

            return (
              <div key={category}>
                {/* Category header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-navy rounded-sm flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-brand-navy text-xl">{category}</h2>
                      <p className="text-xs text-gray-400">{(items as any[]).length} service{(items as any[]).length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  {href !== '/services' && (
                    <Link href={href}
                      className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-red hover:gap-3 transition-all">
                      View full page <ChevronRight size={13} />
                    </Link>
                  )}
                </div>

                {/* Service cards for this category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(items as any[]).map((s: any) => {
                    const imgFile = Array.isArray(s.images) && s.images.length > 0
                      ? s.images[0]
                      : categoryFallback(category)
                    const imgUrl = imgFile.startsWith('http') ? imgFile : `${API}/uploads/${imgFile}`

                    return (
                      <div key={s._id}
                        className="bg-white border border-gray-100 rounded-sm overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-brand-navy">
                          <img src={imgUrl} alt={s.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            onError={e => {
                              const t = e.target as HTMLImageElement
                              t.src = `${API}/uploads/${categoryFallback(category)}`
                            }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent" />
                          {/* Category pill */}
                          <div className="absolute top-3 left-3">
                            <span className="text-[10px] bg-brand-red text-white font-bold px-2.5 py-1 rounded-sm uppercase tracking-wide">
                              {category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="font-heading font-bold text-brand-navy text-base mb-2 group-hover:text-brand-red transition-colors">
                            {s.name}
                          </h3>
                          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                            {s.description}
                          </p>
                          {s.tag && (
                            <p className="text-xs text-brand-gold font-semibold mb-3">{s.tag}</p>
                          )}
                          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                            <Link href={href}
                              className="flex items-center gap-1.5 text-xs font-semibold text-brand-red hover:gap-2.5 transition-all">
                              Learn More <ArrowRight size={12} />
                            </Link>
                            <Link href="/contact"
                              className="ml-auto text-xs font-semibold border border-gray-200 text-gray-600 hover:border-brand-navy hover:text-brand-navy px-3 py-1.5 rounded-sm transition-all">
                              Get Quote
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Link to category detail page */}
                {href !== '/services' && (
                  <div className="mt-4 sm:hidden text-right">
                    <Link href={href} className="text-xs text-brand-red font-semibold hover:underline flex items-center gap-1 justify-end">
                      View full {category} page <ChevronRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-red-100 mb-8 max-w-md mx-auto text-sm">Contact us today for a free consultation.</p>
          <Link href="/contact" className="btn-ghost">Get a Free Quote</Link>
        </div>
      </section>
    </div>
  )
}