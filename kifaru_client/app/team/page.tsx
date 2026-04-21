'use client'
import { useState, useEffect } from 'react'
import { getTeam } from '@/lib/api'
import { HardHat, Calculator, ClipboardList } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'

const orgChart = [
  { level:0, title:'Managing Director', box:'bg-brand-red text-white' },
  { level:1, title:'General Manager / Administrator', box:'bg-brand-navy text-white' },
  { level:2, title:'Construction Engineer', box:'bg-red-100 text-brand-red border border-red-200' },
  { level:2, title:'Quantity Surveyor', box:'bg-yellow-100 text-yellow-800 border border-yellow-200' },
  { level:2, title:'Project Manager', box:'bg-blue-200 text-brand-navy border border-blue-300' },
  { level:2, title:'Marketing Department', box:'bg-blue-100 text-brand-navy' },
  { level:2, title:'Accountant Department', box:'bg-blue-100 text-brand-navy' },
  { level:2, title:'Site Technicians / Supervisors', box:'bg-blue-100 text-brand-navy' },
  { level:2, title:'Head of Technical Personnel', box:'bg-blue-100 text-brand-navy' },
  { level:3, title:'Stores Clerk', box:'bg-gray-100 text-gray-700' },
  { level:3, title:'Plumbing/Drainage', box:'bg-gray-100 text-gray-700' },
  { level:3, title:'Steel Fixers', box:'bg-gray-100 text-gray-700' },
  { level:3, title:'Electricians', box:'bg-gray-100 text-gray-700' },
  { level:3, title:'Masons', box:'bg-gray-100 text-gray-700' },
  { level:3, title:'Carpentry', box:'bg-gray-100 text-gray-700' },
  { level:4, title:'Unskilled Labour', box:'bg-gray-50 text-gray-600 border border-gray-200' },
]

const keyPersonnel = [
  {
    role: 'Construction Engineer',
    icon: HardHat,
    color: 'bg-brand-red/10 text-brand-red border-brand-red/20',
    iconBg: 'bg-brand-red',
    responsibilities: [
      'Structural design and technical oversight',
      'Site inspections and quality control',
      'Coordination of civil works and contractors',
      'Compliance with engineering standards and codes',
      'Technical problem-solving on site',
    ],
    qualifications: 'BSc Civil / Structural Engineering · CRB Registered',
  },
  {
    role: 'Quantity Surveyor',
    icon: Calculator,
    color: 'bg-brand-gold/10 text-yellow-700 border-brand-gold/20',
    iconBg: 'bg-brand-gold',
    responsibilities: [
      'Cost estimation and budget preparation',
      'Bills of quantities and tender documentation',
      'Contract administration and variation orders',
      'Progress valuations and interim certificates',
      'Final account preparation and settlement',
    ],
    qualifications: 'BSc Quantity Surveying · AQSTZ Member',
  },
  {
    role: 'Project Manager',
    icon: ClipboardList,
    color: 'bg-brand-navy/10 text-brand-navy border-brand-navy/20',
    iconBg: 'bg-brand-navy',
    responsibilities: [
      'End-to-end project planning and scheduling',
      'Resource allocation and team coordination',
      'Client liaison and progress reporting',
      'Risk management and issue resolution',
      'Ensuring delivery on time and within budget',
    ],
    qualifications: 'BSc Construction Management / Engineering · PMP Certified',
  },
]

export default function TeamPage() {
  const [team, setTeam] = useState<any[]>([])
  useEffect(() => { getTeam().then(d => { if (Array.isArray(d)) setTeam(d) }).catch(() => {}) }, [])

  return (
    <div>
      <section className="page-hero text-center">
        <div className="max-w-3xl mx-auto">
          <p className="section-subtitle-gold">Our People</p>
          <h1 className="font-heading text-5xl font-bold text-white mb-4">Management Team</h1>
          <div className="w-14 h-0.5 bg-brand-red mx-auto mb-6" />
          <p className="text-blue-200 text-lg leading-relaxed">
            A dedicated team of architects, engineers, surveyors and construction professionals delivering quality projects across Tanzania.
          </p>
        </div>
      </section>

      {/* Team members from DB */}
      {team.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="section-subtitle">Leadership</p>
              <h2 className="section-title">Our Management Team</h2>
              <div className="gold-line mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((m: any) => {
                const img = m.photo ? (m.photo.startsWith('http') ? m.photo : `${API}/uploads/${m.photo}`) : null
                return (
                  <div key={m._id} className="bg-white border border-gray-100 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                    <div className="h-52 bg-gradient-to-br from-brand-navy to-blue-800 flex items-center justify-center">
                      {img ? <img src={img} alt={m.name} className="w-full h-full object-cover" /> : (
                        <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                          <span className="text-white font-heading font-bold text-3xl">{m.name?.[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="font-heading font-bold text-brand-navy text-base mb-0.5">{m.name}</h3>
                      <p className="text-brand-red text-xs font-semibold uppercase tracking-wide mb-1">{m.title}</p>
                      {m.department && <p className="text-xs text-gray-400">{m.department}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── KEY PERSONNEL ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Technical Experts</p>
            <h2 className="section-title">Key Personnel</h2>
            <div className="gold-line mx-auto" />
            <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
              Our core technical team brings deep expertise across construction engineering, cost management and project delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {keyPersonnel.map(p => (
              <div key={p.role} className={`rounded-sm border ${p.color} overflow-hidden`}>
                {/* Header */}
                <div className={`${p.iconBg} px-6 py-5 flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-sm bg-white/15 flex items-center justify-center flex-shrink-0">
                    <p.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-lg leading-tight">{p.role}</h3>
                    <p className="text-white/70 text-xs mt-0.5">{p.qualifications}</p>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="bg-white px-6 py-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Key Responsibilities</p>
                  <ul className="space-y-2.5">
                    {p.responsibilities.map(r => (
                      <li key={r} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0 mt-1.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organisation Structure */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Company Structure</p>
            <h2 className="section-title">Organisation Chart</h2>
            <div className="gold-line mx-auto" />
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
              Led by two directors actively involved in business development, procurement, project management and company administration.
            </p>
          </div>
          <div className="space-y-2">
            {[0,1,2,3,4].map(level => {
              const nodes = orgChart.filter(n => n.level === level)
              return (
                <div key={level}>
                  {level > 0 && (
                    <div className="flex justify-center">
                      <div className="w-0.5 h-5 bg-gray-300" />
                    </div>
                  )}
                  <div className={`flex justify-center gap-3 flex-wrap`}>
                    {nodes.map(n => (
                      <div key={n.title}
                        className={`px-5 py-3 rounded-sm text-center text-xs font-semibold shadow-sm ${n.box}`}
                        style={{ minWidth: nodes.length === 1 ? '220px' : '140px' }}>
                        {n.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* People description */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="section-subtitle">Our Workforce</p>
              <h2 className="section-title mb-6">Expert People, Quality Results</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Kifaru Building Company Limited employs a diverse workforce including permanent staff, contract staff, interns, skilled and semi-skilled casual labor. Every member of our team upholds our values of openness, professionalism and mutual respect.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['Architects','Civil Engineers','Quantity Surveyors','Land Surveyors','Site Supervisors','Electricians','Masons','Carpenters','Plumbers','Truck Drivers'].map(r => (
                  <div key={r} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-brand-red rounded-full flex-shrink-0" />{r}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-brand-navy rounded-sm p-8 text-white">
              <h3 className="font-heading font-bold text-xl mb-4 text-brand-gold">Our Values</h3>
              {['Openness — transparent communication at all levels','Professionalism — maintaining the highest work standards','Mutual Respect — inclusive and supportive workplace','Profitable Growth — rewarding excellence and innovation','Breakthrough Improvement — always finding a better way'].map(v => (
                <div key={v} className="flex items-start gap-3 mb-3">
                  <span className="w-1.5 h-1.5 bg-brand-gold rounded-full flex-shrink-0 mt-2" />
                  <span className="text-sm text-blue-200 leading-relaxed">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}