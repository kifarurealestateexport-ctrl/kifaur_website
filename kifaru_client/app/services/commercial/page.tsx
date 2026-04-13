import Link from 'next/link'
import { CheckCircle, ChevronLeft } from 'lucide-react'
import BookingForm from '@/components/ui/BookingForm'
const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'
export default function CommercialPage() {
  return (
    <div>
      <section className="relative page-hero overflow-hidden">
        <div className="absolute inset-0"><img src={`${API}/uploads/house_aerial2.jpg`} alt="Commercial" className="w-full h-full object-cover opacity-20" /><div className="absolute inset-0 bg-brand-navy/88" /></div>
        <div className="relative max-w-7xl mx-auto">
          <Link href="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-gold text-sm mb-8 transition-colors"><ChevronLeft size={15} /> Back to Services</Link>
          <p className="section-subtitle">Our Services</p>
          <h1 className="font-heading text-5xl font-bold text-white mb-4">Commercial &<br />Industrial Buildings</h1>
          <div className="w-14 h-0.5 bg-brand-red mb-6" />
          <p className="text-gray-300 max-w-2xl text-lg leading-relaxed">From office blocks and hotels to schools, warehouses and industrial facilities — Kifaru delivers commercial construction to international standards across Tanzania.</p>
          <Link href="#quote" className="btn-primary mt-8 inline-flex">Get a Project Quote</Link>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {[{title:'Office Blocks',desc:'Modern commercial office buildings with professional finishes and full MEP systems.'},{title:'Hotels & Lodges',desc:'Full hospitality construction including rooms, reception, restaurant and amenities.'},{title:'Schools & Classrooms',desc:'Educational facilities built to government specifications — classrooms, laboratories and blocks.'},{title:'Warehouses',desc:'Industrial storage facilities with wide-span roofing, reinforced floors and loading bays.'},{title:'Shopping Centres',desc:'Multi-tenant retail and commercial space with parking and full services infrastructure.'},{title:'Healthcare Facilities',desc:'Clinics, medical centres and hospitals built to health ministry standards.'}].map(f => (
              <div key={f.title} className="bg-gray-50 border border-gray-100 rounded-sm p-6 hover:border-brand-red/20 hover:shadow-md transition-all">
                <CheckCircle size={18} className="text-brand-gold mb-3" />
                <h3 className="font-heading font-semibold text-brand-navy text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subtitle">Our Credentials</p>
              <h2 className="section-title mb-6">Built for Commercial Scale</h2>
              {['CRB Class 5 registered for building works — eligible for government and large private contracts','Experienced in multi-storey reinforced concrete frame construction','Modern plant and equipment fleet — tipper trucks, concrete mixers, air compressors','Completed 6+ commercial and institutional projects across Tanzania','Offices in Dar es Salaam, Arusha and Dodoma for regional coverage'].map(item => (
                <div key={item} className="flex items-start gap-3 mb-3"><CheckCircle size={15} className="text-brand-red flex-shrink-0 mt-0.5" /><span className="text-gray-600 text-sm leading-relaxed">{item}</span></div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="h-52 rounded-sm overflow-hidden shadow-md border border-gray-100"><img src={`${API}/uploads/house_aerial2.jpg`} alt="Commercial" className="w-full h-full object-cover" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-36 rounded-sm overflow-hidden shadow-md border border-gray-100"><img src={`${API}/uploads/house_aerial1.jpg`} alt="Site" className="w-full h-full object-cover" /></div>
                <div className="h-36 rounded-sm overflow-hidden shadow-md border border-gray-100"><img src={`${API}/uploads/house_modern.jpg`} alt="Building" className="w-full h-full object-cover" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50" id="quote">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8"><p className="section-subtitle">Commercial Enquiry</p><h2 className="section-title">Discuss Your Project</h2><div className="gold-line mx-auto" /></div>
          <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm"><BookingForm /></div>
        </div>
      </section>
    </div>
  )
}
