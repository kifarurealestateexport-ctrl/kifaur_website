import Link from 'next/link'
import { CheckCircle, ChevronLeft } from 'lucide-react'
import BookingForm from '@/components/ui/BookingForm'
const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'
export default function ConstructionPage() {
  return (
    <div>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0"><img src={`${API}/uploads/house_aerial1.jpg`} alt="Construction" className="w-full h-full object-cover opacity-25" /><div className="absolute inset-0 bg-brand-navy/85" /></div>
        <div className="relative max-w-7xl mx-auto">
          <Link href="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-gold text-sm mb-8 transition-colors"><ChevronLeft size={15} /> Back to Services</Link>
          <p className="section-subtitle">Our Services</p>
          <h1 className="font-heading text-5xl font-bold text-white mb-4">Residential<br />Construction</h1>
          <div className="w-14 h-0.5 bg-brand-red mb-6" />
          <p className="text-gray-300 max-w-2xl text-lg leading-relaxed">From single bungalows to multi-storey family homes — we design and build your dream home with quality materials, skilled craftsmanship and our unique pay-after-handover model.</p>
          <div className="flex gap-4 mt-8"><Link href="#quote" className="btn-primary">Get a Quote</Link><Link href="/properties" className="btn-ghost">View Properties</Link></div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[{title:'Pay After Handover',desc:'You only pay once your house is fully completed and handed over to you.'},{title:'Fixed Price Contracts',desc:'We agree a fixed price upfront. No surprise costs or hidden charges during construction.'},{title:'Full Supervision',desc:'A dedicated site supervisor on every project with weekly progress reports.'}].map(f => (
              <div key={f.title} className="bg-white border border-gray-100 rounded-sm p-6 border-l-4 border-l-brand-red shadow-sm">
                <h3 className="font-heading font-semibold text-brand-navy text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subtitle">What We Build</p>
              <h2 className="section-title mb-6">Residential Property Types</h2>
              <div className="space-y-4">
                {[{title:'2–4 Bedroom Bungalows',desc:'Single-storey homes ideal for families — efficient, affordable and practical.'},{title:'Multi-Storey Family Homes',desc:'Two and three-storey homes with modern finishes, rooftop spaces and compound walls.'},{title:'Gated Compound Villas',desc:'Premium residential villas within secured compounds in Dar es Salaam and Arusha.'},{title:'Rental Apartment Units',desc:'Investment-grade apartment blocks delivering consistent rental income.'}].map(item => (
                  <div key={item.title} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-sm shadow-sm hover:border-brand-red/20 transition-colors">
                    <CheckCircle size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                    <div><h4 className="text-brand-navy font-semibold text-sm mb-1">{item.title}</h4><p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 h-56 rounded-sm overflow-hidden shadow-md border border-gray-100">
                <img src={`${API}/uploads/house_modern.jpg`} alt="Modern house" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="h-40 rounded-sm overflow-hidden shadow-md border border-gray-100">
                <img src={`${API}/uploads/house_aerial1.jpg`} alt="Construction aerial" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="h-40 rounded-sm overflow-hidden shadow-md border border-gray-100">
                <img src={`${API}/uploads/house_aerial2.jpg`} alt="Construction site" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">How It Works</p>
            <h2 className="section-title">Our Construction Process</h2>
            <div className="gold-line mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Consultation & Design','Contract & Permits','Foundation & Structure','Finishing Works','Handover & Payment'].map((step,i) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-red/10 border-2 border-brand-red flex items-center justify-center mx-auto mb-3">
                  <span className="text-brand-red font-heading font-bold text-lg">{i+1}</span>
                </div>
                <p className="text-sm text-brand-navy font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50" id="quote">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8"><p className="section-subtitle">Start Your Project</p><h2 className="section-title">Request a Construction Quote</h2><div className="gold-line mx-auto" /></div>
          <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm"><BookingForm /></div>
        </div>
      </section>
    </div>
  )
}
