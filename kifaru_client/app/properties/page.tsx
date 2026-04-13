'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Search, X, Building2 } from 'lucide-react'
import PropertyCard, { Property } from '@/components/ui/PropertyCard'
import { getProperties } from '@/lib/api'
function PropertiesContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ type: searchParams.get('type') || '', status: searchParams.get('status') || '', q: searchParams.get('q') || '', minPrice: '', maxPrice: '', bedrooms: '' })
  const [showFilters, setShowFilters] = useState(false)
  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params: Record<string,string> = {}
      if (filters.type) params.type = filters.type
      if (filters.status) params.status = filters.status
      if (filters.q) params.q = filters.q
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice
      if (filters.bedrooms) params.bedrooms = filters.bedrooms
      const data = await getProperties(params)
      setProperties(data.properties || data || [])
    } catch { setProperties([]) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchProperties() }, [filters.type, filters.status])
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchProperties() }
  return (
    <div>
      <section className="page-hero text-center">
        <div className="max-w-3xl mx-auto">
          <p className="section-subtitle-gold">Browse Listings</p>
          <h1 className="font-heading text-4xl font-bold text-white mb-4">Properties</h1>
          <div className="w-14 h-0.5 bg-brand-red mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Find your perfect property across Tanzania</p>
        </div>
      </section>
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-sm px-3">
                <Search size={16} className="text-gray-400 flex-shrink-0" />
                <input className="flex-1 text-sm outline-none py-2.5 text-gray-700 placeholder-gray-400" placeholder="Search by location, title..." value={filters.q} onChange={e => setFilters({...filters, q: e.target.value})} />
                {filters.q && <button type="button" onClick={() => setFilters({...filters, q: ''})}><X size={14} className="text-gray-400" /></button>}
              </div>
              <select className="input-field md:w-40" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
                <option value="">All Types</option>
                <option value="house">House</option><option value="apartment">Apartment</option>
                <option value="land">Land & Plots</option><option value="commercial">Commercial</option>
              </select>
              <select className="input-field md:w-40" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
                <option value="">Buy or Rent</option><option value="sale">For Sale</option><option value="rent">For Rent</option>
              </select>
              <button type="submit" className="btn-primary whitespace-nowrap">Search</button>
              <button type="button" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-sm text-sm text-gray-600 hover:border-brand-navy transition-colors">
                <SlidersHorizontal size={15} /> Filters
              </button>
            </div>
            {showFilters && (
              <div className="flex flex-col sm:flex-row gap-3 mt-3 pt-3 border-t border-gray-100">
                <input className="input-field sm:w-44" type="number" placeholder="Min Price (TZS)" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
                <input className="input-field sm:w-44" type="number" placeholder="Max Price (TZS)" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
                <select className="input-field sm:w-44" value={filters.bedrooms} onChange={e => setFilters({...filters, bedrooms: e.target.value})}>
                  <option value="">Any Bedrooms</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+ Beds</option>)}
                </select>
              </div>
            )}
          </form>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_,i) => (
                <div key={i} className="bg-white rounded-sm shadow-sm h-72 animate-pulse border border-gray-100">
                  <div className="h-48 bg-gray-200 rounded-t-sm" /><div className="p-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <><p className="text-sm text-gray-500 mb-6">{properties.length} properties found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div></>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-sm">
              <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="font-heading text-xl text-gray-500 mb-2">No properties found</p>
              <p className="text-sm text-gray-400">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
export default function PropertiesPage() {
  return <Suspense fallback={<div className="min-h-screen bg-gray-50" />}><PropertiesContent /></Suspense>
}
