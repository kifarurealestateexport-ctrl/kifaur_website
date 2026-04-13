'use client'

import { useState, useEffect } from 'react'
import { X, ZoomIn } from 'lucide-react'
import { getGallery } from '@/lib/api'

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'

const categories = ['All', 'Projects', 'Paving', 'Team', 'Activities', 'Equipment']

// Default gallery items from company profile photos
const defaultGallery = [
  { _id:'g1',  category:'Projects',    image:'house_aerial1.jpg',  title:'Construction Site, Dar es Salaam' },
  { _id:'g2',  category:'Projects',    image:'house_aerial2.jpg',  title:'Residential Project Progress' },
  { _id:'g3',  category:'Projects',    image:'house_modern.jpg',   title:'Completed Modern Villa' },
  { _id:'g4',  category:'Paving',      image:'paving_grey.jpg',    title:'Grey Rectangular Paving Blocks' },
  { _id:'g5',  category:'Paving',      image:'paving_red.jpg',     title:'Red Square Pavers' },
  { _id:'g6',  category:'Paving',      image:'paving_hex.jpg',     title:'Hexagonal Paving Blocks' },
]

export default function GalleryPage() {
  const [gallery,    setGallery]    = useState<any[]>(defaultGallery)
  const [filter,     setFilter]     = useState('All')
  const [lightbox,   setLightbox]   = useState<string | null>(null)

  useEffect(() => {
    getGallery().then(d => { if (Array.isArray(d) && d.length > 0) setGallery(d) }).catch(() => {})
  }, [])

  const filtered = filter === 'All' ? gallery : gallery.filter(g => g.category === filter)

  const imgUrl = (img: string) => img.startsWith('http') ? img : `${API}/uploads/${img}`

  return (
    <div>
      <section className="page-hero text-center">
        <div className="max-w-3xl mx-auto">
          <p className="section-subtitle-gold">Photo Gallery</p>
          <h1 className="font-heading text-5xl font-bold text-white mb-4">Our Gallery</h1>
          <div className="w-14 h-0.5 bg-brand-red mx-auto mb-6" />
          <p className="text-blue-200 text-lg leading-relaxed">
            Browse our project photos, paving showcases, team activities and equipment across Tanzania.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-gray-50 border-b border-gray-200 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`text-xs font-semibold px-4 py-2 rounded-sm transition-all ${
                filter === cat ? 'bg-brand-navy text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-navy hover:text-brand-navy'
              }`}>
              {cat}
              {cat !== 'All' && <span className="ml-1 text-[10px] opacity-60">({gallery.filter(g => g.category === cat).length})</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-sm">
              <p className="text-gray-400">No photos in this category yet. Add them via the Admin Panel.</p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
              {filtered.map((item: any) => (
                <div key={item._id}
                  className="break-inside-avoid cursor-pointer group relative rounded-sm overflow-hidden"
                  onClick={() => setLightbox(imgUrl(item.image))}>
                  <img src={imgUrl(item.image)} alt={item.title || 'Gallery'}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-sm" />
                  <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/40 transition-colors duration-300 rounded-sm flex items-center justify-center">
                    <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-xs font-medium">{item.title}</p>
                      <p className="text-gray-300 text-[10px]">{item.category}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <X size={20} className="text-white" />
          </button>
          <img src={lightbox} alt="Gallery" className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl"
            onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}
