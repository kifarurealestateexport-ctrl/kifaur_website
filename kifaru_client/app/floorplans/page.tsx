'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bed, Bath, Square, ArrowRight, Phone } from 'lucide-react'
import { getFloorPlans } from '@/lib/api'

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'

const defaultPlans = [
  { _id: 'fp1', name: '2-Bedroom Bungalow',    type: 'Residential · Bungalow',   bedrooms: 2, bathrooms: 1, area: 80,  price: '45M',  note: 'Pay after handover · Flexible installments' },
  { _id: 'fp2', name: '3-Bedroom House',        type: 'Residential · Standalone', bedrooms: 3, bathrooms: 2, area: 120, price: '75M',  note: 'Pay after handover · Flexible installments' },
  { _id: 'fp3', name: '4-Bedroom Villa',        type: 'Residential · Villa',      bedrooms: 4, bathrooms: 3, area: 200, price: '130M', note: 'Pay after handover · Flexible installments' },
  { _id: 'fp4', name: 'Studio Apartment',       type: 'Apartment · Investment',   bedrooms: 1, bathrooms: 1, area: 45,  price: '28M',  note: 'Rental income opportunity' },
  { _id: 'fp5', name: '5-Bedroom Family Home',  type: 'Residential · Premium',    bedrooms: 5, bathrooms: 4, area: 280, price: '190M', note: 'Custom design available' },
  { _id: 'fp6', name: '2-Bedroom Apartment',    type: 'Apartment · Standard',     bedrooms: 2, bathrooms: 2, area: 70,  price: '40M',  note: 'Pay after handover' },
]

export default function FloorPlansPage() {
  const [plans, setPlans] = useState<any[]>(defaultPlans)
  const [selected, setSelected] = useState<any | null>(null)

  useEffect(() => {
    getFloorPlans()
      .then(d => { if (Array.isArray(d) && d.length > 0) setPlans(d) })
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="max-w-7xl mx-auto">
          <p className="section-subtitle-gold">House Plans</p>
          <h1 className="font-heading text-5xl font-bold text-white mb-4">Floor Plans & Packages</h1>
          <div className="w-14 h-0.5 bg-brand-red mb-6" />
          <p className="text-blue-200 max-w-2xl text-lg leading-relaxed">
            Browse our ready-made house plans. All packages include design, construction and handover.
            Pay only after your house is complete.
          </p>
        </div>
      </section>

      {/* Pay-after note */}
      <section className="bg-brand-red py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white font-semibold text-sm text-center sm:text-left">
            All plans come with our signature <strong>Pay After Handover</strong> model — you only pay once your house is complete.
          </p>
          <Link href="/contact" className="flex-shrink-0 bg-white text-brand-red text-xs font-bold px-5 py-2.5 rounded-sm hover:bg-red-50 transition-colors whitespace-nowrap">
            Request Custom Plan
          </Link>
        </div>
      </section>

      {/* Plans grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan: any) => {
              const images = plan.images || []
              const imgUrl = images[0]
                ? (images[0].startsWith('http') ? images[0] : `${API}/uploads/${images[0]}`)
                : null

              return (
                <div key={plan._id}
                  className="bg-white border border-gray-100 rounded-sm overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

                  {/* Image or placeholder */}
                  <div className="h-48 bg-gradient-to-br from-brand-navy to-blue-800 relative overflow-hidden">
                    {imgUrl ? (
                      <img src={imgUrl} alt={plan.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {/* SVG floor plan illustration */}
                        <svg viewBox="0 0 200 150" className="w-40 h-30 opacity-30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="10" y="10" width="180" height="130" stroke="white" strokeWidth="2" />
                          <rect x="10" y="10" width="90" height="70" stroke="white" strokeWidth="1.5" />
                          <rect x="100" y="10" width="90" height="70" stroke="white" strokeWidth="1.5" />
                          <rect x="10" y="80" width="60" height="60" stroke="white" strokeWidth="1.5" />
                          <rect x="70" y="80" width="70" height="60" stroke="white" strokeWidth="1.5" />
                          <rect x="140" y="80" width="50" height="60" stroke="white" strokeWidth="1.5" />
                          <line x1="10" y1="80" x2="190" y2="80" stroke="white" strokeWidth="1.5" />
                          <line x1="100" y1="10" x2="100" y2="80" stroke="white" strokeWidth="1.5" />
                          {/* Door symbols */}
                          <path d="M70 110 Q70 90 85 90" stroke="white" strokeWidth="1" fill="none" />
                          <path d="M140 50 Q140 30 155 30" stroke="white" strokeWidth="1" fill="none" />
                          {/* Window symbols */}
                          <line x1="30" y1="10" x2="30" y2="14" stroke="white" strokeWidth="3" />
                          <line x1="50" y1="10" x2="50" y2="14" stroke="white" strokeWidth="3" />
                          <line x1="120" y1="10" x2="120" y2="14" stroke="white" strokeWidth="3" />
                          <line x1="160" y1="10" x2="160" y2="14" stroke="white" strokeWidth="3" />
                        </svg>
                      </div>
                    )}
                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-xs bg-white/90 text-brand-navy px-2.5 py-1 rounded-sm font-semibold">{plan.type}</span>
                    </div>
                    {/* Price badge */}
                    <div className="absolute top-3 right-3">
                      <span className="text-sm bg-brand-red text-white px-3 py-1 rounded-sm font-heading font-bold">TZS {plan.price}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-heading font-bold text-brand-navy text-lg mb-3 group-hover:text-brand-red transition-colors">
                      {plan.name}
                    </h3>

                    {/* Specs */}
                    <div className="flex items-center gap-4 py-3 border-t border-b border-gray-100 mb-4">
                      {plan.bedrooms && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Bed size={13} className="text-brand-gold" />
                          <span>{plan.bedrooms} Bedrooms</span>
                        </div>
                      )}
                      {plan.bathrooms && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Bath size={13} className="text-brand-gold" />
                          <span>{plan.bathrooms} Bathrooms</span>
                        </div>
                      )}
                      {plan.area && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Square size={13} className="text-brand-gold" />
                          <span>{plan.area} m²</span>
                        </div>
                      )}
                    </div>

                    {plan.note && (
                      <p className="text-xs text-green-600 font-medium bg-green-50 border border-green-100 rounded-sm px-3 py-2 mb-4">
                        ✓ {plan.note}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(plan)}
                        className="flex-1 text-xs font-semibold text-brand-navy border border-brand-navy/20 px-3 py-2.5 rounded-sm hover:bg-brand-navy hover:text-white transition-all">
                        View Details
                      </button>
                      <Link href="/contact"
                        className="flex-1 btn-primary text-xs py-2.5 justify-center">
                        Get Quote
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Plan detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-sm max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="bg-brand-navy p-6 flex items-start justify-between">
              <div>
                <h2 className="font-heading font-bold text-white text-xl">{selected.name}</h2>
                <p className="text-blue-300 text-sm mt-1">{selected.type}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/60 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-5 text-center">
                {selected.bedrooms && (
                  <div className="bg-gray-50 rounded-sm p-3">
                    <Bed size={20} className="text-brand-gold mx-auto mb-1" />
                    <p className="font-bold text-brand-navy text-lg">{selected.bedrooms}</p>
                    <p className="text-xs text-gray-400">Bedrooms</p>
                  </div>
                )}
                {selected.bathrooms && (
                  <div className="bg-gray-50 rounded-sm p-3">
                    <Bath size={20} className="text-brand-gold mx-auto mb-1" />
                    <p className="font-bold text-brand-navy text-lg">{selected.bathrooms}</p>
                    <p className="text-xs text-gray-400">Bathrooms</p>
                  </div>
                )}
                {selected.area && (
                  <div className="bg-gray-50 rounded-sm p-3">
                    <Square size={20} className="text-brand-gold mx-auto mb-1" />
                    <p className="font-bold text-brand-navy text-lg">{selected.area}m²</p>
                    <p className="text-xs text-gray-400">Total Area</p>
                  </div>
                )}
              </div>
              <div className="bg-red-50 border border-red-100 rounded-sm p-4 mb-5 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Starting Price</p>
                <p className="font-heading text-2xl font-bold text-brand-red">TZS {selected.price}</p>
              </div>
              {selected.note && (
                <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-sm px-4 py-2.5 mb-5">✓ {selected.note}</p>
              )}
              <div className="flex gap-3">
                <a href={`https://wa.me/255714940231?text=I'm interested in the ${selected.name} floor plan (TZS ${selected.price}). Can you provide more details?`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-3 px-4 rounded-sm text-center transition-colors flex items-center justify-center gap-2">
                  <Phone size={13} />WhatsApp
                </a>
                <Link href="/contact" onClick={() => setSelected(null)}
                  className="flex-1 btn-primary text-xs py-3 justify-center">
                  Get Full Quote <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-14 bg-brand-navy text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Don't See the Right Plan?</h2>
          <p className="text-blue-200 mb-8 text-sm">We design custom floor plans to your exact requirements and budget. Contact us for a free consultation.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-primary">Request Custom Design</Link>
            <a href="https://wa.me/255714940231" target="_blank" rel="noopener noreferrer"
              className="btn-ghost">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </div>
  )
}