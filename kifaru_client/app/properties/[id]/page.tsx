'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Bed, Bath, Square, Phone, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import BookingForm from '@/components/ui/BookingForm'
import { getProperty } from '@/lib/api'
import { Property } from '@/components/ui/PropertyCard'
const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'
export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [imgIndex, setImgIndex] = useState(0)
  useEffect(() => { getProperty(id).then(setProperty).catch(() => {}).finally(() => setLoading(false)) }, [id])
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" /></div>
  if (!property) return <div className="min-h-screen flex items-center justify-center text-gray-500">Property not found. <Link href="/properties" className="text-brand-red ml-2">← Back</Link></div>
  const images = property.images?.length ? property.images : ['house_aerial1.jpg']
  const imgUrl = (img: string) => img.startsWith('http') ? img : `${API}/uploads/${img}`
  const formatPrice = (p: number) => p >= 1_000_000 ? `TZS ${(p / 1_000_000).toFixed(0)}M` : `TZS ${p.toLocaleString()}`
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/properties" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-red transition-colors mb-6"><ArrowLeft size={15} /> Back to Properties</Link>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm">
              <div className="h-80 md:h-[480px] relative">
                <img src={imgUrl(images[imgIndex])} alt={property.title} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIndex(i => Math.max(0, i-1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"><ChevronLeft size={18} /></button>
                    <button onClick={() => setImgIndex(i => Math.min(images.length-1, i+1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"><ChevronRight size={18} /></button>
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-sm">{imgIndex+1}/{images.length}</div>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
                  {images.map((img,i) => (
                    <button key={i} onClick={() => setImgIndex(i)} className={`flex-shrink-0 w-16 h-12 rounded-sm overflow-hidden border-2 transition-colors ${i === imgIndex ? 'border-brand-red' : 'border-gray-200'}`}>
                      <img src={imgUrl(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-sm ${property.status === 'sale' ? 'bg-brand-red text-white' : 'bg-brand-navy text-white'}`}>For {property.status === 'sale' ? 'Sale' : 'Rent'}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-sm capitalize">{property.type}</span>
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-navy mb-2">{property.title}</h1>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4"><MapPin size={14} className="text-brand-red" />{property.location}</div>
              <p className="font-heading text-3xl font-bold text-brand-red mb-6">{formatPrice(property.price)}{property.status === 'rent' && <span className="text-base font-normal text-gray-500">/month</span>}</p>
              {(property.bedrooms || property.bathrooms || property.area) && (
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-100 mb-6">
                  {property.bedrooms !== undefined && <div className="text-center"><Bed size={20} className="text-brand-gold mx-auto mb-1" /><p className="font-bold text-brand-navy">{property.bedrooms}</p><p className="text-xs text-gray-400">Bedrooms</p></div>}
                  {property.bathrooms !== undefined && <div className="text-center"><Bath size={20} className="text-brand-gold mx-auto mb-1" /><p className="font-bold text-brand-navy">{property.bathrooms}</p><p className="text-xs text-gray-400">Bathrooms</p></div>}
                  {property.area && <div className="text-center"><Square size={20} className="text-brand-gold mx-auto mb-1" /><p className="font-bold text-brand-navy">{property.area}m²</p><p className="text-xs text-gray-400">Area</p></div>}
                </div>
              )}
              {property.description && <><h3 className="font-heading font-semibold text-brand-navy text-lg mb-3">Description</h3><p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{property.description}</p></>}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm sticky top-24">
              <h3 className="font-heading font-bold text-brand-navy text-lg mb-1">Interested?</h3>
              <p className="text-sm text-gray-500 mb-5">Fill in the form and our agent will contact you.</p>
              <BookingForm propertyId={property._id} propertyTitle={property.title} />
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <a href="tel:+255714940231" className="flex items-center justify-center gap-2 text-sm font-semibold text-brand-navy hover:text-brand-red transition-colors"><Phone size={15} />+255 714 940 231</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
