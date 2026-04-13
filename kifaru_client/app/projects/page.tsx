'use client'

import { useState, useEffect } from 'react'
import { MapPin, Calendar, CheckCircle, Clock } from 'lucide-react'
import { getProjects } from '@/lib/api'

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'

const fallbacks = [
  'house_aerial1.jpg', 'house_aerial2.jpg', 'house_modern.jpg',
  'house_aerial1.jpg', 'house_aerial2.jpg', 'house_modern.jpg',
]

// Pre-loaded from company profile
const seedProjects = [
  { _id:'p1',  name:'Commercial House, Mchangani, Kinondon', location:'Dar es Salaam', year:'2015/2016', status:'Completed', description:'Construction of commercial house at Plot No. 16 Block 34A Mchangani Street Makumbusho.' },
  { _id:'p2',  name:'School Roofing, Bonyokwa Secondary',    location:'Dar es Salaam', year:'2021',       status:'Completed', description:'Renovation of 6 classrooms roofing at Bonyokwa Secondary School.' },
  { _id:'p3',  name:'Residential House, Mpigi Magoe',        location:'Dar es Salaam', year:'2020',       status:'Completed', description:'Construction of residential house at Mpigi Magoe.' },
  { _id:'p4',  name:'Residential House, Kibaha',             location:'Dar es Salaam', year:'2020',       status:'Completed', description:'Construction of residential house at Kibaha.' },
  { _id:'p5',  name:'Residential House, Magamoyo',           location:'Dar es Salaam', year:'2020',       status:'Completed', description:'Construction of residential house at Magamoyo.' },
  { _id:'p6',  name:'Residential House, Arusha',             location:'Arusha',        year:'2020',       status:'Completed', description:'Construction of residential house in Arusha.' },
  { _id:'p7',  name:'Residential House, Morogoro',           location:'Morogoro',      year:'2019/2021',  status:'Completed', description:'Construction of residential house in Morogoro.' },
  { _id:'p8',  name:'Residential House, Rombo',              location:'Kilimanjaro',   year:'2020',       status:'Completed', description:'Construction of residential house at Rombo, Kilimanjaro.' },
  { _id:'p9',  name:'Commercial Houses (6 units), Dodoma',   location:'Dodoma',        year:'2022',       status:'Completed', description:'Construction of 6 commercial houses in Dodoma.' },
  { _id:'p10', name:'Hotel, Mipango',                        location:'Dodoma',        year:'2020/2022',  status:'Completed', description:'Construction of hotel at Mipango, Dodoma.' },
  { _id:'p11', name:'Service Apartments, Majumba Sita',      location:'Dar es Salaam', year:'2020/2022',  status:'Completed', description:'Construction of residential apartments at Majumba Sita.' },
  { _id:'p12', name:'Classrooms, Fountain Gate',             location:'Dodoma',        year:'2021/2022',  status:'Completed', description:'Construction of classrooms at Fountain Gate, Dodoma.' },
  { _id:'p13', name:'Residential House, Kisasa',             location:'Dodoma',        year:'2022',       status:'Completed', description:'Construction of residential house at Kisasa, Dodoma.' },
  { _id:'p14', name:'Commercial House, Madale',              location:'Dar es Salaam', year:'2023',       status:'Completed', description:'Construction of commercial house at Madale, Dar es Salaam.' },
  { _id:'p15', name:'Residential House, Kigamboni',          location:'Dar es Salaam', year:'2023',       status:'Completed', description:'Construction of residential house at Kigamboni.' },
  { _id:'p16', name:'Residential House, Mbagala Chamazi',    location:'Dar es Salaam', year:'2023',       status:'Completed', description:'Construction of residential house at Mbagala Chamazi.' },
  { _id:'p17', name:'Laboratories, Fountain Gate',           location:'Dodoma',        year:'2023/2024',  status:'Completed', description:'Construction of laboratories at Fountain Gate, Dodoma.' },
  { _id:'p18', name:'Residential House, Madale',             location:'Dar es Salaam', year:'2024',       status:'Completed', description:'Construction of residential house at Madale.' },
  { _id:'p19', name:'Fence, Morogoro',                       location:'Morogoro',      year:'2024',       status:'Completed', description:'Construction of fence in Morogoro.' },
  { _id:'p20', name:'Service Apartments, Mlalakua Savei',    location:'Dar es Salaam', year:'2023/2024',  status:'Ongoing',   description:'Proposed construction of service apartments at Plot No. 361/1 365/2 Mlalakua Savei.' },
  { _id:'p21', name:'Residential House, Ihumbu Dodoma',      location:'Dodoma',        year:'2024',       status:'Ongoing',   description:'Proposed construction of residential house at Plot 1106 Block C, Ihumbu, Dodoma.' },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>(seedProjects)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    getProjects().then(d => { if (Array.isArray(d) && d.length > 0) setProjects(d) }).catch(() => {})
  }, [])

  const filtered = filter === 'All' ? projects : projects.filter(p => p.status === filter)
  const completed = projects.filter(p => p.status === 'Completed').length
  const ongoing   = projects.filter(p => p.status === 'Ongoing').length

  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="max-w-7xl mx-auto">
          <p className="section-subtitle-gold">Our Portfolio</p>
          <h1 className="font-heading text-5xl font-bold text-white mb-4">Projects & Works</h1>
          <div className="w-14 h-0.5 bg-brand-red mb-6" />
          <p className="text-blue-200 max-w-2xl text-lg leading-relaxed">
            Over 19 completed and ongoing construction projects across Dar es Salaam, Dodoma, Arusha, Morogoro and Kilimanjaro since 2015.
          </p>
          <div className="flex gap-6 mt-8">
            <div className="text-center">
              <p className="font-heading text-3xl font-bold text-white">{completed}+</p>
              <p className="text-xs text-blue-300 uppercase tracking-wide mt-0.5">Completed</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="font-heading text-3xl font-bold text-brand-gold">{ongoing}</p>
              <p className="text-xs text-blue-300 uppercase tracking-wide mt-0.5">Ongoing</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="font-heading text-3xl font-bold text-white">5</p>
              <p className="text-xs text-blue-300 uppercase tracking-wide mt-0.5">Regions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-gray-50 border-b border-gray-200 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Filter:</span>
          {['All', 'Completed', 'Ongoing'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-4 py-2 rounded-sm transition-all ${filter === f ? 'bg-brand-navy text-white' : 'border border-gray-200 text-gray-600 hover:border-brand-navy hover:text-brand-navy bg-white'}`}>
              {f} {f !== 'All' && `(${f === 'Completed' ? completed : ongoing})`}
            </button>
          ))}
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p: any, i: number) => {
              const imgFile = p.image ? p.image : fallbacks[i % fallbacks.length]
              const imgUrl = imgFile.startsWith('http') ? imgFile : `${API}/uploads/${imgFile}`
              return (
                <div key={p._id} className="bg-white border border-gray-100 rounded-sm overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                  <div className="h-44 overflow-hidden bg-gray-100 relative">
                    <img src={imgUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        p.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {p.status === 'Completed'
                          ? <><CheckCircle size={11} />Completed</>
                          : <><Clock size={11} />Ongoing</>}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><MapPin size={11} className="text-brand-red" />{p.location}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} className="text-brand-navy" />{p.year}</span>
                    </div>
                    <h3 className="font-heading font-semibold text-brand-navy text-sm leading-snug group-hover:text-brand-red transition-colors">{p.name}</h3>
                    {p.description && <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">{p.description}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-brand-navy text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Want to See Your Project Here?</h2>
          <p className="text-blue-200 mb-8">Contact us today for a free consultation and project quote.</p>
          <a href="/contact" className="btn-primary">Book a Consultation</a>
        </div>
      </section>
    </div>
  )
}
