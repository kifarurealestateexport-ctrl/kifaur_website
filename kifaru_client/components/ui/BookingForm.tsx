'use client'

import { useState } from 'react'
import { submitBooking } from '@/lib/api'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface Props {
  propertyId?: string
  propertyTitle?: string
  darkBg?: boolean
}

export default function BookingForm({ propertyId, propertyTitle, darkBg = false }: Props) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    service: propertyTitle ? 'Property Inquiry' : '',
    location: '',
    message: propertyTitle ? `I am interested in: ${propertyTitle}` : '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  const services = [
    'Residential House Construction', 'Commercial Building',
    'Paving & Kerbstones Supply', 'Paving Installation',
    'Real Estate Purchase', 'Property Rental',
    'Landscaping', 'Electrical Works', 'Joinery Works',
    'Property Inquiry', 'Other',
  ]

  const inp = darkBg
    ? 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-sm text-sm text-white placeholder-white/40 focus:outline-none focus:border-brand-gold transition-colors'
    : 'input-field'
  const lbl = darkBg ? 'text-gray-300' : 'text-gray-600'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.phone || !form.service) {
      setError('Please fill in Name, Phone and Service.')
      return
    }
    setLoading(true); setError('')
    try {
      await submitBooking({ ...form, propertyId, name: `${form.firstName} ${form.lastName}`.trim() })
      setSuccess(true)
    } catch {
      setError('Submission failed. Please call us on +255 714 940 231.')
    } finally { setLoading(false) }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-sm p-8 text-center">
        <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
        <h3 className="font-heading font-bold text-green-800 text-xl mb-2">Request Submitted!</h3>
        <p className="text-green-700 text-sm">Our team will contact you within 24 hours.</p>
        <button onClick={() => setSuccess(false)} className="mt-4 text-sm text-green-600 underline">Submit another</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />{error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${lbl}`}>First Name *</label>
          <input className={inp} placeholder="Amina" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        </div>
        <div>
          <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${lbl}`}>Last Name</label>
          <input className={inp} placeholder="Mohamed" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        </div>
      </div>

      <div>
        <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${lbl}`}>Phone / WhatsApp *</label>
        <input className={inp} type="tel" placeholder="+255 7XX XXX XXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      </div>

      <div>
        <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${lbl}`}>Email</label>
        <input className={inp} type="email" placeholder="amina@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </div>

      <div>
        <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${lbl}`}>Service Required *</label>
        <select className={`${inp} cursor-pointer`} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
          <option value="">-- Select a Service --</option>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${lbl}`}>Project Location</label>
        <input className={inp} placeholder="Dar es Salaam, Arusha..." value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
      </div>

      <div>
        <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${lbl}`}>Message / Details</label>
        <textarea className={`${inp} min-h-[90px] resize-none`} placeholder="Tell us about your project..."
          value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
      </div>

      <button type="submit" disabled={loading}
        className="w-full btn-primary py-4 text-sm tracking-widest uppercase font-bold disabled:opacity-50 disabled:cursor-not-allowed justify-center">
        {loading ? <><Loader size={15} className="animate-spin" /> Sending...</> : 'Send Request'}
      </button>

      <p className="text-center text-xs text-gray-400">
        Or call us: <a href="tel:+255714940231" className="text-brand-red font-semibold hover:underline">+255 714 940 231</a>
      </p>
    </form>
  )
}
