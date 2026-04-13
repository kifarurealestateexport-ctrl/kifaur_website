'use client'
import Link from 'next/link'
import { CheckCircle, ArrowRight, ChevronLeft } from 'lucide-react'
import BookingForm from '@/components/ui/BookingForm'
const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'
const pavingTypes = [
  { name:'Rectangular / Brick Pavers', image:`${API}/uploads/paving_grey.jpg`, colors:['Grey','Black','Custom'], uses:['Driveways','Pathways','Parking areas','Commercial floors'], desc:'The most versatile paving block, available in herringbone, basket-weave and stretcher bond patterns. Ideal for both pedestrian and vehicle traffic areas.' },
  { name:'Square / Flat Pavers',       image:`${API}/uploads/paving_red.jpg`,  colors:['Red','Terracotta','Grey','White'], uses:['Courtyards','Pool surrounds','Patios','Public plazas'], desc:'Smooth-faced square pavers that create clean, modern surfaces. Popular in residential compounds and upmarket commercial developments across Tanzania.' },
  { name:'Hexagonal Pavers',           image:`${API}/uploads/paving_hex.jpg`,  colors:['Dark Grey','Black','Charcoal'], uses:['Decorative areas','Garden paths','Public spaces','Feature zones'], desc:'Distinctive hexagonal shape creates a honeycomb effect that is both visually striking and structurally interlocking. Ideal for decorative surfaces.' },
]
const specs = [
  { label:'Compressive Strength', value:'≥ 35 MPa' },
  { label:'Water Absorption',     value:'< 6%' },
  { label:'Thickness Options',    value:'60mm · 80mm · 100mm' },
  { label:'Standard Size',        value:'200 × 100mm (rect.)' },
  { label:'Certification',        value:'CRB Approved' },
  { label:'Minimum Order',        value:'100 sq. metres' },
]
export default function PavingPage() {
  return (
    <div>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0"><img src={`${API}/uploads/paving_grey.jpg`} alt="Paving" className="w-full h-full object-cover opacity-20" /><div className="absolute inset-0 bg-brand-navy/90" /></div>
        <div className="relative max-w-7xl mx-auto">
          <Link href="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-gold text-sm mb-8 transition-colors"><ChevronLeft size={15} /> Back to Services</Link>
          <p className="section-subtitle">Our Services</p>
          <h1 className="font-heading text-5xl font-bold text-white mb-4">Paving Blocks &<br />Kerbstones</h1>
          <div className="w-14 h-0.5 bg-brand-red mb-6" />
          <p className="text-gray-300 max-w-2xl text-lg leading-relaxed">Tanzania's premier manufacturer and supplier of high-quality concrete paving blocks in multiple shapes, sizes and colours — delivered to your site across Tanzania.</p>
          <div className="flex gap-4 mt-8"><Link href="#products" className="btn-primary">View Products</Link><Link href="#quote" className="btn-ghost">Request Quote</Link></div>
        </div>
      </section>
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-5">
            {[{title:'CRB Approved',desc:'All our paving blocks meet the Contractors Registration Board quality standards.'},{title:'Own Manufacturing',desc:'We manufacture in-house ensuring consistent quality and competitive pricing.'},{title:'Nationwide Delivery',desc:'Our tipper truck fleet delivers to Dar es Salaam, Arusha, Dodoma and beyond.'},{title:'Full Installation',desc:'Complete paving installation service — supply, lay and finish to professional standard.'}].map(f => (
              <div key={f.title} className="bg-white border border-gray-100 rounded-sm p-6 border-t-4 border-t-brand-red shadow-sm">
                <CheckCircle size={18} className="text-brand-gold mb-3" />
                <h3 className="font-heading font-semibold text-brand-navy text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white" id="products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subtitle">Product Range</p>
            <h2 className="section-title">Paving Block Types</h2>
            <div className="gold-line mx-auto" />
          </div>
          <div className="space-y-16">
            {pavingTypes.map((product, i) => (
              <div key={product.name} className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="rounded-sm overflow-hidden shadow-md h-72 lg:h-96 border border-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <h3 className="font-heading text-2xl font-bold text-brand-navy mb-3">{product.name}</h3>
                  <div className="w-10 h-0.5 bg-brand-red mb-4" />
                  <p className="text-gray-600 leading-relaxed mb-6">{product.desc}</p>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2">Available Colours</p>
                      <div className="flex flex-wrap gap-2">{product.colors.map(c => <span key={c} className="text-xs border border-gray-200 text-gray-600 px-3 py-1 rounded-sm bg-gray-50">{c}</span>)}</div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2">Applications</p>
                      <div className="space-y-1">{product.uses.map(u => <div key={u} className="flex items-center gap-2 text-xs text-gray-500"><span className="w-1 h-1 bg-brand-red rounded-full flex-shrink-0" />{u}</div>)}</div>
                    </div>
                  </div>
                  <Link href="#quote" className="btn-primary text-sm">Get a Quote <ArrowRight size={14} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subtitle">Quality Standards</p>
              <h2 className="section-title mb-2">Technical Specifications</h2>
              <div className="gold-line" />
              <p className="text-gray-600 leading-relaxed mb-8">All Kifaru paving blocks are manufactured to meet or exceed Tanzania Bureau of Standards (TBS) specifications for interlocking concrete paving blocks.</p>
              <div className="grid grid-cols-2 gap-3">
                {specs.map(s => (
                  <div key={s.label} className="bg-white border border-gray-100 rounded-sm p-4 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-brand-navy font-semibold text-sm">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-sm overflow-hidden shadow-md h-80 lg:h-full min-h-[320px] border border-gray-100">
              <img src={`${API}/uploads/paving_hex.jpg`} alt="Hexagonal paving" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white" id="quote">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="section-subtitle">Get Pricing</p>
            <h2 className="section-title">Request a Paving Quote</h2>
            <div className="gold-line mx-auto" />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-8"><BookingForm /></div>
        </div>
      </section>
    </div>
  )
}
