'use client'

import Link from 'next/link'
import { MapPin, Bed, Bath, Square, Bookmark } from 'lucide-react'
import { useState } from 'react'

export interface Property {
  _id: string
  title: string
  price: number
  type: string
  status: 'sale' | 'rent'
  location: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  images: string[]
  featured?: boolean
  description?: string
}

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'

export default function PropertyCard({ property }: { property: Property }) {
  const [saved,   setSaved]   = useState(false)
  const [imgErr,  setImgErr]  = useState(false)

  const imageUrl = !imgErr && property.images?.[0]
    ? property.images[0].startsWith('http') ? property.images[0] : `${API}/uploads/${property.images[0]}`
    : `${API}/uploads/house_aerial1.jpg`

  const formatPrice = (price: number) => {
    if (price >= 1_000_000_000) return `TZS ${(price / 1_000_000_000).toFixed(1)}B`
    if (price >= 1_000_000)     return `TZS ${(price / 1_000_000).toFixed(0)}M`
    if (price >= 1_000)         return `TZS ${(price / 1_000).toFixed(0)}K`
    return `TZS ${price.toLocaleString()}`
  }

  return (
    <div className="bg-white border border-gray-100 rounded-sm overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img src={imageUrl} alt={property.title} onError={() => setImgErr(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-sm ${
            property.status === 'sale' ? 'bg-brand-red text-white' : 'bg-brand-navy text-white'
          }`}>For {property.status === 'sale' ? 'Sale' : 'Rent'}</span>
          {property.featured && (
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-sm bg-brand-gold text-brand-navy">Featured</span>
          )}
        </div>

        {/* Type */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs bg-white/90 text-brand-navy font-semibold capitalize px-2.5 py-1 rounded-sm">{property.type}</span>
        </div>

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

        {/* Specs */}
        {(property.bedrooms !== undefined || property.bathrooms !== undefined || property.area) && (
          <div className="flex items-center gap-4 py-3 border-t border-b border-gray-100 mb-4">
            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Bed size={12} className="text-brand-gold" />{property.bedrooms} Bed
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Bath size={12} className="text-brand-gold" />{property.bathrooms} Bath
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Square size={12} className="text-brand-gold" />{property.area} m²
              </div>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading font-bold text-brand-navy text-lg">{formatPrice(property.price)}</p>
            {property.status === 'rent' && <p className="text-xs text-gray-400">/month</p>}
          </div>
          <Link href={`/properties/${property._id}`}
            className="text-xs font-semibold text-brand-red border border-brand-red/30 px-4 py-2 rounded-sm hover:bg-brand-red hover:text-white transition-all">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
