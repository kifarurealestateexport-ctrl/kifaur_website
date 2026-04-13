'use client'

import { useState, useEffect } from 'react'
import { getEquipment } from '@/lib/api'

// Default from company profile PDF
const defaultEquipment = [
  { _id:'e1',  name:'Tipper Truck 20-Tons (Scania FAW)',       quantity:2, condition:'Very Good (Brand New)', category:'Vehicles'  },
  { _id:'e2',  name:'Tipper Truck 7-Tons (FUSO)',              quantity:2, condition:'Good Working',          category:'Vehicles'  },
  { _id:'e3',  name:'Tipper Truck 2-Tons (Mitsubishi Canter)', quantity:5, condition:'Good',                  category:'Vehicles'  },
  { _id:'e4',  name:'Toyota Land Cruiser',                     quantity:1, condition:'Good',                  category:'Vehicles'  },
  { _id:'e5',  name:'Toyota Chaser',                           quantity:1, condition:'Very Good',             category:'Vehicles'  },
  { _id:'e6',  name:'Toyota Brevis',                           quantity:1, condition:'Very Good',             category:'Vehicles'  },
  { _id:'e7',  name:'Concrete Mixer RDCM500',                  quantity:2, condition:'Good',                  category:'Machinery' },
  { _id:'e8',  name:'Air Compressor XAS 97DD',                 quantity:2, condition:'Very Good',             category:'Machinery' },
  { _id:'e9',  name:'Pocker Vibrator Mechanical AMG3200',      quantity:2, condition:'Working',               category:'Machinery' },
  { _id:'e10', name:'Pocker Vibrator Robin EY20-3C',           quantity:2, condition:'Very Good',             category:'Machinery' },
  { _id:'e11', name:'Compactor',                               quantity:1, condition:'Working',               category:'Machinery' },
  { _id:'e12', name:'Block Making Machines (6" Moulds) & Mixer Set', quantity:8, condition:'Good',           category:'Machinery' },
  { _id:'e13', name:'Generator 5KVA',                          quantity:2, condition:'Good',                  category:'Machinery' },
  { _id:'e14', name:'Angle Grinder 9" Makita GA9020',          quantity:2, condition:'Good',                  category:'Tools'     },
  { _id:'e15', name:'Circular Saw Makita N5900B 335mm',        quantity:2, condition:'Fair',                  category:'Tools'     },
  { _id:'e16', name:'Hand Drilling Machine Makita HR2475',     quantity:1, condition:'Good',                  category:'Tools'     },
  { _id:'e17', name:'Pressure Washer',                         quantity:2, condition:'Good',                  category:'Tools'     },
  { _id:'e18', name:'Bajaj Boxer BM150',                       quantity:1, condition:'Very Good',             category:'Vehicles'  },
  { _id:'e19', name:'Wood Working Machines (Various Types)',   quantity:1, condition:'Good',                  category:'Machinery' },
]

const conditionColor: Record<string, string> = {
  'Very Good (Brand New)': 'bg-green-100 text-green-700',
  'Very Good':             'bg-green-100 text-green-700',
  'Good Working':          'bg-blue-100 text-blue-700',
  'Good':                  'bg-blue-100 text-blue-700',
  'Working':               'bg-yellow-100 text-yellow-700',
  'Fair':                  'bg-orange-100 text-orange-700',
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<any[]>(defaultEquipment)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    getEquipment().then(d => { if (Array.isArray(d) && d.length > 0) setEquipment(d) }).catch(() => {})
  }, [])

  const categories = ['All', ...Array.from(new Set(equipment.map(e => e.category)))]
  const filtered = activeCategory === 'All' ? equipment : equipment.filter(e => e.category === activeCategory)

  return (
    <div>
      <section className="page-hero">
        <div className="max-w-7xl mx-auto">
          <p className="section-subtitle-gold">Our Capacity</p>
          <h1 className="font-heading text-5xl font-bold text-white mb-4">Plants & Equipment</h1>
          <div className="w-14 h-0.5 bg-brand-red mb-6" />
          <p className="text-blue-200 max-w-2xl text-lg leading-relaxed">
            Kifaru Building Company maintains an extensive inventory of modern plants and equipment currently deployed across Dar es Salaam and project sites throughout Tanzania.
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label:'Total Equipment Items', value: equipment.length + '+' },
              { label:'Vehicles',   value: equipment.filter(e => e.category === 'Vehicles').reduce((s, e) => s + e.quantity, 0) + '' },
              { label:'Machinery',  value: equipment.filter(e => e.category === 'Machinery').reduce((s, e) => s + e.quantity, 0) + '' },
              { label:'Tools',      value: equipment.filter(e => e.category === 'Tools').reduce((s, e) => s + e.quantity, 0) + '' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-heading text-3xl font-bold text-brand-navy">{s.value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="bg-white border-b border-gray-100 py-3 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-4 py-2 rounded-sm transition-all ${
                activeCategory === cat ? 'bg-brand-navy text-white' : 'border border-gray-200 text-gray-600 hover:border-brand-navy hover:text-brand-navy bg-white'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Equipment table */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto rounded-sm border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-navy text-white">
                  <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-widest">S/N</th>
                  <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-widest">Equipment / Plant Name</th>
                  <th className="text-center py-4 px-5 text-xs font-bold uppercase tracking-widest">Qty</th>
                  <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-widest">Category</th>
                  <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-widest">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item: any, i: number) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-5 text-gray-400 text-xs font-mono">{i + 1}</td>
                    <td className="py-3.5 px-5 font-medium text-brand-navy">{item.name}</td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex w-8 h-8 items-center justify-center bg-brand-navy text-white text-xs font-bold rounded-full">{item.quantity}</span>
                    </td>
                    <td className="py-3.5 px-5 text-gray-500 text-xs capitalize">{item.category}</td>
                    <td className="py-3.5 px-5">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${conditionColor[item.condition] || 'bg-gray-100 text-gray-600'}`}>
                        {item.condition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Equipment currently deployed at Head Office in Dar es Salaam and various project sites across Tanzania.
          </p>
        </div>
      </section>
    </div>
  )
}
