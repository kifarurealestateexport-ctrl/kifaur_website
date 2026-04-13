'use client'
import { useState, useEffect } from 'react'
import { Phone, Mail } from 'lucide-react'
import { getAgents } from '@/lib/api'
const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'
const defaultAgents = [
  { _id:'1', name:'Ahmed Salim',   title:'Senior Property Agent', phone:'+255 714 940 231', email:'ahmed@kifaru.co.tz',  speciality:'Residential Properties', experience:'8 years' },
  { _id:'2', name:'Grace Mwamba',  title:'Commercial Specialist',  phone:'+255 713 860 510', email:'grace@kifaru.co.tz',  speciality:'Commercial & Industrial', experience:'6 years' },
  { _id:'3', name:'John Makundi',  title:'Construction Manager',   phone:'+255 714 940 231', email:'john@kifaru.co.tz',   speciality:'Building & Construction', experience:'10 years' },
]
export default function AgentsPage() {
  const [agents, setAgents] = useState(defaultAgents)
  useEffect(() => { getAgents().then(d => { if (d?.length) setAgents(d) }).catch(() => {}) }, [])
  return (
    <div>
      <section className="page-hero text-center">
        <div className="max-w-3xl mx-auto">
          <p className="section-subtitle-gold">Meet the Team</p>
          <h1 className="font-heading text-4xl font-bold text-white mb-4">Our Agents</h1>
          <div className="w-14 h-0.5 bg-brand-red mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Expert professionals ready to help you find, build or sell your property.</p>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((a: any) => {
              const imgUrl = a.photo ? (a.photo.startsWith('http') ? a.photo : `${API}/uploads/${a.photo}`) : null
              return (
                <div key={a._id} className="bg-white border border-gray-100 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                  <div className="h-56 bg-gradient-to-br from-brand-navy to-navy-800 flex items-center justify-center">
                    {imgUrl ? <img src={imgUrl} alt={a.name} className="w-full h-full object-cover" /> : (
                      <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                        <span className="text-white font-heading font-bold text-4xl">{a.name?.[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-brand-navy text-xl mb-0.5">{a.name}</h3>
                    <p className="text-brand-red text-xs font-semibold uppercase tracking-wide mb-3">{a.title}</p>
                    {a.speciality && <p className="text-xs text-gray-500 mb-1"><span className="font-medium text-gray-700">Speciality:</span> {a.speciality}</p>}
                    {a.experience && <p className="text-xs text-gray-500 mb-4"><span className="font-medium text-gray-700">Experience:</span> {a.experience}</p>}
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      {a.phone && <a href={`tel:${a.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-red transition-colors"><Phone size={13} className="text-brand-red flex-shrink-0" />{a.phone}</a>}
                      {a.email && <a href={`mailto:${a.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-red transition-colors"><Mail size={13} className="text-brand-red flex-shrink-0" />{a.email}</a>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
