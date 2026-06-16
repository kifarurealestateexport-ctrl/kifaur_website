'use client'

import Link from 'next/link'
import { MapPin, Bookmark } from 'lucide-react'
import { useState } from 'react'

export interface Property {
  _id: string
  title: string
  location: string
  images: string[]
  featured?: boolean
  description?: string
  status?: 'sale' | 'rent'
  type?: string
  price?: number
  bedrooms?: number
  bathrooms?: number
  area?: number
}

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'

export default function PropertyCard({ property }: { property: Property }) {
  const [saved,  setSaved]  = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const imageUrl = !imgErr && property.images?.[0]
    ? property.images[0].startsWith('http') ? property.images[0] : `${API}/uploads/${property.images[0]}`
    : `${API}/uploads/house_aerial1.jpg`

  return (
    <div className="bg-white border border-gray-100 rounded-sm overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img src={imageUrl} alt={property.title} onError={() => setImgErr(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-sm bg-brand-gold text-brand-navy">Featured</span>
          </div>
        )}

        {/* Save */}
        <button onClick={(e) => { e.preventDefault(); setSaved(!saved) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-sm bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm">
          <Bookmark size={14} className={saved ? 'fill-brand-red text-brand-red' : 'text-gray-400'} />
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-brand-navy text-base leading-snug line-clamp-2 mb-2 group-hover:text-brand-red transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
          <MapPin size={11} className="flex-shrink-0 text-brand-red" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        {property.description && (
          <p className="text-xs text-gray-500 line-clamp-3 mb-4">{property.description}</p>
        )}

        {/* CTA */}
        <div className="flex items-center justify-end pt-3 border-t border-gray-100">
          <Link href={`/properties/${property._id}`}
            className="text-xs font-semibold text-brand-red border border-brand-red/30 px-4 py-2 rounded-sm hover:bg-brand-red hover:text-white transition-all">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}