import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import BookingForm from '@/components/ui/BookingForm'
export default function ContactPage() {
  return (
    <div>
      <section className="page-hero text-center">
        <div className="max-w-3xl mx-auto">
          <p className="section-subtitle-gold">Get In Touch</p>
          <h1 className="font-heading text-4xl font-bold text-white mb-4">Contact Us</h1>
          <div className="w-14 h-0.5 bg-brand-red mx-auto mb-4" />
          <p className="text-gray-400 text-sm">We're here to help. Reach out for a free consultation, project quote or property inquiry.</p>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand-navy mb-6">Contact Information</h2>
              <div className="space-y-6 mb-8">
                {[{icon:Phone,label:'Phone / WhatsApp',lines:['+255 714 940 231','+255 713 860 510']},{icon:Mail,label:'Email',lines:['kifarurealestate22@gmail.com']},{icon:MapPin,label:'Head Office',lines:['P.O. Box 19614','Ubungo, Goba, Njia Nne','Dar es Salaam, Tanzania']},{icon:Clock,label:'Business Hours',lines:['Mon – Fri: 8:00 AM – 6:00 PM','Sat: 9:00 AM – 4:00 PM','Sun: By Appointment']}].map(c => (
                  <div key={c.label} className="flex gap-4">
                    <div className="w-10 h-10 bg-brand-red rounded-sm flex items-center justify-center flex-shrink-0"><c.icon size={18} className="text-white" /></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">{c.label}</p>{c.lines.map((l,i) => <p key={i} className="text-sm text-brand-navy font-medium">{l}</p>)}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm">
                <h3 className="font-heading font-semibold text-brand-navy mb-4">Branch Offices</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Arusha','Dodoma'].map(city => (
                    <div key={city} className="border border-gray-100 rounded-sm p-4 text-center bg-gray-50">
                      <MapPin size={16} className="text-brand-red mx-auto mb-2" />
                      <p className="font-semibold text-brand-navy text-sm">{city}</p>
                      <p className="text-xs text-gray-400">Branch Office</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm">
              <h2 className="font-heading font-bold text-brand-navy text-2xl mb-1">Send Us a Message</h2>
              <p className="text-sm text-gray-500 mb-6">Fill in the form and our team will get back to you within 24 hours.</p>
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
