'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Building2, ClipboardList, Briefcase, Package,
  Star, Home, Users, Settings, LogOut, Plus, Edit2, Trash2, X,
  CheckCircle, AlertCircle, Loader, ChevronRight,
  Image as ImageIcon, RefreshCw, Wrench, Camera, UserCheck, Award,
  Phone, Mail, MapPin, Calendar, Search, Filter, Download, ArrowLeft,
  Eye, EyeOff, Lock, User
} from 'lucide-react'
import {
  adminLogin, getBookings, updateBookingStatus, deleteBooking,
  getProperties, createProperty, updateProperty, deleteProperty,
  getServices, createService, updateService, deleteService,
  getProjects, createProject, updateProject, deleteProject,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getFloorPlans, createFloorPlan, updateFloorPlan, deleteFloorPlan,
  getAgents, createAgent, updateAgent, deleteAgent,
  getEquipment, createEquipment, updateEquipment, deleteEquipment,
  getGallery, createGallery, deleteGallery,
  getTeam, createTeam, updateTeam, deleteTeam,
  getCertificates, createCertificate, updateCertificate, deleteCertificate,
  getHomepageSettings, updateHomepageSettings,
} from '@/lib/api'

type Panel = 'overview'|'bookings'|'customers'|'properties'|'services'|'projects'|'testimonials'|'floorplans'|'agents'|'equipment'|'gallery'|'team'|'certificates'|'homepage'

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api','') || 'http://localhost:5001'
const inp = 'w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-navy transition-colors'
const sel = `${inp} cursor-pointer`
const ta  = `${inp} resize-none`

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-sm shadow-xl text-sm font-medium border ${
      type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      {type === 'success' ? <CheckCircle size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-red-500" />}
      {msg}
      <button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

function Badge({ status }: { status: string }) {
  const s: Record<string,string> = {
    new:'bg-blue-100 text-blue-700', contacted:'bg-green-100 text-green-700', closed:'bg-gray-100 text-gray-500',
    Completed:'bg-green-100 text-green-700', Ongoing:'bg-yellow-100 text-yellow-700',
    sale:'bg-red-100 text-red-700', rent:'bg-blue-100 text-blue-700',
  }
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${s[status]||'bg-gray-100 text-gray-500'}`}>{status}</span>
}

function ABtn({ onClick, icon: Icon, danger }: any) {
  return (
    <button onClick={onClick} className={`p-1.5 rounded-sm border transition-all ${
      danger
        ? 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50'
        : 'border-gray-200 text-gray-400 hover:border-brand-navy hover:text-brand-navy hover:bg-blue-50'
    }`}>
      <Icon size={13} />
    </button>
  )
}

function Tbl({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-sm border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-brand-navy text-white">
            {headers.map(h => <th key={h} className="text-left py-3 px-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.length === 0
            ? <tr><td colSpan={headers.length} className="text-center text-gray-400 py-12 text-sm">No records yet</td></tr>
            : rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {row.map((cell, j) => <td key={j} className="py-3 px-4 text-gray-600 whitespace-nowrap">{cell}</td>)}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

function Fld({ label, children }: any) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed,  setAuthed]  = useState(false)
  const [lFrm,    setLFrm]   = useState({ username:'admin', password:'' })
  const [lErr,    setLErr]   = useState('')
  const [lLd,     setLLd]    = useState(false)
  const [showPw,  setShowPw] = useState(false)
  const [panel,   setPanel]  = useState<Panel>('overview')
  const [toast,   setToast]  = useState<any>(null)
  const [loading, setLoading]= useState(false)

  const [bookings,     setBookings]     = useState<any[]>([])
  const [properties,   setProperties]   = useState<any[]>([])
  const [services,     setServices]     = useState<any[]>([])
  const [projects,     setProjects]     = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [floorplans,   setFloorplans]   = useState<any[]>([])
  const [agents,       setAgents]       = useState<any[]>([])
  const [equipment,    setEquipment]    = useState<any[]>([])
  const [gallery,      setGallery]      = useState<any[]>([])
  const [team,         setTeam]         = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [homepage,     setHomepage]     = useState<any>({})

  const showToast = (msg: string, type = 'success') => setToast({ msg, type })

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('kifaru_token')) setAuthed(true)
  }, [])
  useEffect(() => { if (authed) loadAll() }, [authed])

  const loadAll = async () => {
    setLoading(true)
    const results = await Promise.allSettled([
      getBookings(), getProperties(), getServices(), getProjects(),
      getTestimonials(), getFloorPlans(), getAgents(), getEquipment(),
      getGallery(), getTeam(), getCertificates(), getHomepageSettings(),
    ])
    const [b,p,s,pr,t,f,a,eq,g,tm,certs,h] = results
    if (b.status==='fulfilled')     setBookings(b.value.bookings||b.value||[])
    if (p.status==='fulfilled')     setProperties(p.value.properties||p.value||[])
    if (s.status==='fulfilled')     setServices(s.value||[])
    if (pr.status==='fulfilled')    setProjects(pr.value||[])
    if (t.status==='fulfilled')     setTestimonials(t.value||[])
    if (f.status==='fulfilled')     setFloorplans(f.value||[])
    if (a.status==='fulfilled')     setAgents(a.value||[])
    if (eq.status==='fulfilled')    setEquipment(eq.value||[])
    if (g.status==='fulfilled')     setGallery(g.value||[])
    if (tm.status==='fulfilled')    setTeam(tm.value||[])
    if (certs.status==='fulfilled') setCertificates(certs.value||[])
    if (h.status==='fulfilled')     setHomepage(h.value||{})
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLLd(true); setLErr('')
    try {
      const d = await adminLogin(lFrm)
      localStorage.setItem('kifaru_token', d.token)
      setAuthed(true)
    } catch { setLErr('Invalid username or password. Please try again.') }
    finally { setLLd(false) }
  }

  // ─── LOGIN PAGE ────────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen flex">

      {/* ── Left panel: hero image with logo showcase ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center">
        {/* Background image */}
        <img
          src={`${API}/uploads/hero.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        {/* Deep navy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 to-[#0a1628]/40" />
        {/* Subtle diagonal grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Centered content */}
        <div className="relative z-10 flex flex-col items-center text-center px-12">

          {/* Logo in frosted glass card */}
          <div className="mb-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <img
              src={`${API}/uploads/logo.png`}
              alt="Kifaru Logo"
              className="h-28 w-auto object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.style.display = 'none'
                const fallback = img.nextElementSibling as HTMLElement | null
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            {/* Fallback K — hidden until needed */}
            <div className="hidden w-28 h-28 items-center justify-center">
              <span className="text-white font-bold text-6xl tracking-tight">K</span>
            </div>
          </div>

          <h1 className="font-heading text-4xl font-bold text-white tracking-wide leading-tight mb-2">
            KIFARU
          </h1>
          <div className="w-10 h-0.5 bg-red-500 mx-auto mb-3" />
          <p className="text-blue-200 text-sm tracking-[0.2em] uppercase font-medium mb-10">
            Construction & Real Estate
          </p>

          {/* Feature pills */}
          <div className="space-y-3 w-full max-w-xs">
            {[
              { icon: Building2, label: 'Property Management' },
              { icon: Package,   label: 'Project Tracking' },
              { icon: Users,     label: 'Customer Database' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-3">
                <div className="w-7 h-7 rounded-lg bg-red-600/80 flex items-center justify-center flex-shrink-0">
                  <Icon size={13} className="text-white" />
                </div>
                <span className="text-white/90 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom strip */}
        <div className="absolute bottom-0 left-0 right-0 px-10 py-5 flex items-center justify-between border-t border-white/10">
          <span className="text-white/40 text-xs tracking-widest uppercase">Admin Portal</span>
          <span className="text-white/40 text-xs">© {new Date().getFullYear()} Kifaru</span>
        </div>
      </div>

      {/* ── Right panel: clean login form ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12 relative">
        {/* Subtle dot-grid background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="w-full max-w-md relative z-10">

          {/* Mobile logo (shown only below lg) */}
          <div className="flex lg:hidden flex-col items-center mb-10">
            <div className="p-4 rounded-2xl bg-brand-navy shadow-xl mb-4">
              <img
                src={`${API}/uploads/logo.png`}
                alt="Kifaru"
                className="h-14 w-auto object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement
                  img.style.display = 'none'
                  const fb = img.nextElementSibling as HTMLElement | null
                  if (fb) fb.style.display = 'flex'
                }}
              />
              <div className="hidden w-14 h-14 items-center justify-center">
                <span className="text-white font-bold text-3xl">K</span>
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-brand-navy">KIFARU</h1>
            <p className="text-gray-400 text-xs tracking-widest uppercase mt-1">Admin Portal</p>
          </div>

          {/* Login card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Top rainbow accent bar */}
            <div className="h-1 bg-gradient-to-r from-brand-navy via-red-600 to-brand-navy" />

            <div className="px-8 pt-8 pb-9">
              <div className="mb-8">
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
                <p className="text-gray-400 text-sm">Sign in to your admin dashboard</p>
              </div>

              {/* Error alert */}
              {lErr && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3.5 rounded-xl mb-6">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
                  <span>{lErr}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">

                {/* Username */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <User size={15} />
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-navy/10 transition-all"
                      placeholder="admin"
                      value={lFrm.username}
                      onChange={e => setLFrm({...lFrm, username: e.target.value})}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Lock size={15} />
                    </div>
                    <input
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-navy/10 transition-all"
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={lFrm.password}
                      onChange={e => setLFrm({...lFrm, password: e.target.value})}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={lLd}
                  className="w-full flex items-center justify-center gap-2.5 bg-brand-navy hover:bg-brand-navy/90 active:scale-[0.98] text-white font-bold tracking-widest uppercase text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-brand-navy/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {lLd
                    ? <><Loader size={15} className="animate-spin" /><span>Signing in...</span></>
                    : <span>Sign In</span>
                  }
                </button>
              </form>

              {/* Credentials hint */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <p className="text-xs text-gray-400 text-center">
                  Default: <span className="font-semibold text-gray-500">admin</span> / <span className="font-semibold text-gray-500">kifaru2025</span>
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} Kifaru Construction & Real Estate
          </p>
        </div>
      </div>
    </div>
  )

  const customers = deriveCustomers(bookings)

  const navItems = [
    { id:'overview',      label:'Overview',      icon:LayoutDashboard },
    { id:'bookings',      label:'Bookings',      icon:ClipboardList,  count:bookings.filter(b=>b.status==='new').length },
    { id:'customers',     label:'Customers',     icon:Users,          count:customers.length },
    { id:'properties',    label:'Properties',    icon:Building2,      count:properties.length },
    { id:'services',      label:'Services',      icon:Briefcase,      count:services.length },
    { id:'projects',      label:'Projects',      icon:Package,        count:projects.length },
    { id:'testimonials',  label:'Testimonials',  icon:Star,           count:testimonials.length },
    { id:'floorplans',    label:'Floor Plans',   icon:Home,           count:floorplans.length },
    { id:'agents',        label:'Agents',        icon:Users,          count:agents.length },
    { id:'equipment',     label:'Equipment',     icon:Wrench,         count:equipment.length },
    { id:'gallery',       label:'Gallery',       icon:Camera,         count:gallery.length },
    { id:'team',          label:'Team',          icon:UserCheck,      count:team.length },
    { id:'certificates',  label:'Certificates',  icon:Award,          count:certificates.length },
    { id:'homepage',      label:'Homepage',      icon:Settings },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sidebar */}
      <aside className="w-56 bg-brand-navy flex flex-col fixed top-0 left-0 h-full z-40 overflow-y-auto">

        {/* ── Sidebar Header with Logo ── */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img
              src={`${API}/uploads/logo.png`}
              alt="Kifaru"
              className="h-9 w-auto object-contain flex-shrink-0"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.style.display = 'none'
                const fallback = img.nextElementSibling as HTMLElement | null
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            {/* Fallback tile */}
            <div
              className="w-9 h-9 bg-brand-red rounded-sm items-center justify-center flex-shrink-0"
              style={{ display: 'none' }}
            >
              <span className="text-white font-heading font-bold text-sm">K</span>
            </div>
            <div>
              <p className="font-heading font-bold text-white text-sm leading-tight">KIFARU</p>
              <p className="text-[10px] text-blue-300 tracking-widest">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPanel(item.id as Panel)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-all ${
                panel === item.id ? 'bg-brand-red text-white' : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}>
              <item.icon size={14} />
              <span className="flex-1 text-left">{item.label}</span>
              {typeof (item as any).count === 'number' && (item as any).count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  panel === item.id ? 'bg-white/20 text-white' : 'bg-white/10 text-blue-300'
                }`}>{(item as any).count}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-white/10 space-y-1">
          <a href="/" className="w-full flex items-center gap-2 text-blue-300 hover:text-white text-xs py-1.5 transition-colors">
            <ArrowLeft size={12} />Back to Website
          </a>
          <button onClick={loadAll} className="w-full flex items-center gap-2 text-blue-300 hover:text-white text-xs py-1.5 transition-colors">
            <RefreshCw size={12} />{loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button onClick={() => { localStorage.removeItem('kifaru_token'); setAuthed(false) }}
            className="w-full flex items-center gap-2 text-blue-300 hover:text-red-400 text-xs py-1.5 transition-colors">
            <LogOut size={12} />Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 min-h-screen">
        <div className="p-8">
          {panel==='overview'     && <OverviewPanel bookings={bookings} properties={properties} projects={projects} gallery={gallery} customers={customers} setPanel={setPanel} />}
          {panel==='bookings'     && <BookingsPanel data={bookings} setData={setBookings} showToast={showToast} />}
          {panel==='customers'    && <CustomersPanel bookings={bookings} showToast={showToast} />}
          {panel==='properties'   && <PropertiesPanel data={properties} setData={setProperties} showToast={showToast} />}

          {panel==='services'     && <SimplePanel title="Service" data={services} setData={setServices} showToast={showToast}
            createFn={createService} updateFn={updateService} deleteFn={deleteService} withImages="multi"
            fields={[
              {k:'name',     l:'Service Name', req:true},
              {k:'category', l:'Category',     req:true,
               sel:['Residential Construction','Commercial Buildings','Paving & Kerbstones','Landscaping','Electrical Works','Joinery & Carpentry','Real Estate','Other'],
               def:'Paving & Kerbstones'},
              {k:'tag',         l:'Short Tag',    ph:'e.g. Supply · Installation'},
              {k:'description', l:'Description',  ta:true, full:true, req:true},
            ]} />}

          {panel==='projects'     && <SimplePanel title="Project" data={projects} setData={setProjects} showToast={showToast}
            createFn={createProject} updateFn={updateProject} deleteFn={deleteProject} withImages="single"
            fields={[{k:'name',l:'Project Name',req:true},{k:'location',l:'Location',req:true},{k:'year',l:'Year',ph:'2024'},{k:'status',l:'Status',sel:['Completed','Ongoing'],def:'Completed'},{k:'description',l:'Description',ta:true,full:true}]} />}

          {panel==='testimonials' && <SimplePanel title="Testimonial" data={testimonials} setData={setTestimonials} showToast={showToast}
            createFn={createTestimonial} updateFn={updateTestimonial} deleteFn={deleteTestimonial}
            fields={[{k:'name',l:'Client Name',req:true},{k:'role',l:'Role / Location',ph:'Homeowner, Dar es Salaam'},{k:'rating',l:'Rating (1-5)',type:'number',def:'5'},{k:'text',l:'Testimonial',ta:true,full:true,req:true}]} />}

          {panel==='floorplans'   && <SimplePanel title="Floor Plan" data={floorplans} setData={setFloorplans} showToast={showToast}
            createFn={createFloorPlan} updateFn={updateFloorPlan} deleteFn={deleteFloorPlan} withImages="multi"
            fields={[{k:'name',l:'Plan Name',req:true},{k:'type',l:'Type',ph:'Residential · Bungalow'},{k:'bedrooms',l:'Bedrooms',type:'number'},{k:'bathrooms',l:'Bathrooms',type:'number'},{k:'area',l:'Area (m²)',type:'number'},{k:'price',l:'Price',ph:'85M'},{k:'note',l:'Payment Note',full:true,ph:'Pay after handover'}]} />}

          {panel==='agents'       && <SimplePanel title="Agent" data={agents} setData={setAgents} showToast={showToast}
            createFn={createAgent} updateFn={updateAgent} deleteFn={deleteAgent} withImages="photo"
            fields={[{k:'name',l:'Full Name',req:true},{k:'title',l:'Job Title',ph:'Senior Property Agent'},{k:'phone',l:'Phone'},{k:'email',l:'Email'},{k:'speciality',l:'Speciality'},{k:'experience',l:'Experience',ph:'5 years'}]} />}

          {panel==='equipment'    && <SimplePanel title="Equipment" data={equipment} setData={setEquipment} showToast={showToast}
            createFn={createEquipment} updateFn={updateEquipment} deleteFn={deleteEquipment}
            fields={[{k:'name',l:'Equipment Name',req:true,full:true},{k:'quantity',l:'Quantity',type:'number',def:'1'},{k:'category',l:'Category',sel:['Vehicles','Machinery','Tools','Other'],def:'Machinery'},{k:'condition',l:'Condition',sel:['Very Good (Brand New)','Very Good','Good Working','Good','Working','Fair'],def:'Good'},{k:'notes',l:'Notes',ta:true,full:true}]} />}

          {panel==='gallery'      && <GalleryPanel data={gallery} setData={setGallery} showToast={showToast} />}

          {panel==='team'         && <SimplePanel title="Team Member" data={team} setData={setTeam} showToast={showToast}
            createFn={createTeam} updateFn={updateTeam} deleteFn={deleteTeam} withImages="photo"
            fields={[{k:'name',l:'Full Name',req:true},{k:'title',l:'Job Title',req:true},{k:'department',l:'Department',ph:'Technical / Management'},{k:'order',l:'Display Order',type:'number',def:'0'},{k:'description',l:'Bio',ta:true,full:true}]} />}

          {panel==='certificates' && <CertificatesPanel data={certificates} setData={setCertificates} showToast={showToast} />}

          {panel==='homepage'     && <HomepagePanel homepage={homepage} setHomepage={setHomepage} showToast={showToast} />}
        </div>
      </main>
    </div>
  )
}

// ─── DERIVE CUSTOMERS ────────────────────────────────────────────────────────
function deriveCustomers(bookings: any[]) {
  const map = new Map<string, any>()
  bookings.forEach(b => {
    const key = b.phone || b.email || b.name
    if (!key) return
    if (map.has(key)) {
      const existing = map.get(key)
      existing.bookings.push(b)
      existing.lastContact = new Date(b.createdAt) > new Date(existing.lastContact)
        ? b.createdAt : existing.lastContact
    } else {
      map.set(key, {
        id: key, name: b.name, phone: b.phone||'—', email: b.email||'—',
        location: b.location||'—', firstContact: b.createdAt, lastContact: b.createdAt, bookings: [b],
      })
    }
  })
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()
  )
}

// ─── CUSTOMERS PANEL ─────────────────────────────────────────────────────────
function CustomersPanel({ bookings, showToast }: any) {
  const [search,       setSearch]       = useState('')
  const [selected,     setSelected]     = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const customers = deriveCustomers(bookings)

  const filtered = customers.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || c.bookings.some((b: any) => b.status === statusFilter)
    return matchSearch && matchStatus
  })

  const exportCSV = () => {
    const headers = ['Name','Phone','Email','Location','Total Bookings','Last Contact','Services']
    const rows = filtered.map(c => [
      c.name, c.phone, c.email, c.location, c.bookings.length,
      new Date(c.lastContact).toLocaleDateString(),
      c.bookings.map((b: any) => b.service).join(' | '),
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = 'kifaru-customers.csv'; a.click()
    URL.revokeObjectURL(url)
    showToast('Customers exported as CSV')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-navy">Customers</h1>
          <p className="text-gray-400 text-sm mt-0.5">{customers.length} unique customers from {bookings.length} bookings</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-brand-navy hover:text-brand-navy text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-sm transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { l:'Total Customers',  v:customers.length, cl:'border-brand-navy' },
          { l:'New Enquiries',    v:customers.filter(c=>c.bookings.some((b:any)=>b.status==='new')).length,       cl:'border-blue-500' },
          { l:'Contacted',        v:customers.filter(c=>c.bookings.some((b:any)=>b.status==='contacted')).length, cl:'border-green-500' },
          { l:'Repeat Customers', v:customers.filter(c=>c.bookings.length>1).length,                              cl:'border-brand-gold' },
        ].map(s => (
          <div key={s.l} className={`bg-white border border-gray-200 border-l-4 ${s.cl} rounded-sm p-4 shadow-sm`}>
            <p className="font-heading text-2xl font-bold text-brand-navy">{s.v}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className={`${inp} pl-9`} placeholder="Search by name, phone, email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-sm text-gray-700 focus:outline-none focus:border-brand-navy"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        {(search || statusFilter !== 'all') && (
          <button onClick={() => { setSearch(''); setStatusFilter('all') }} className="text-xs text-gray-400 hover:text-brand-red transition-colors">Clear</button>
        )}
      </div>

      <div className="flex gap-5">
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center text-gray-400 py-16 text-sm">No customers found</div>
            ) : (
              filtered.map(c => (
                <button key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)}
                  className={`w-full flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0 text-left transition-all hover:bg-gray-50 ${
                    selected?.id === c.id ? 'bg-blue-50 border-l-4 border-l-brand-navy' : ''
                  }`}>
                  <div className="w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{c.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-brand-navy text-sm truncate">{c.name}</p>
                      {c.bookings.length > 1 && (
                        <span className="text-[10px] font-bold bg-brand-gold/20 text-yellow-700 px-1.5 py-0.5 rounded-full flex-shrink-0">{c.bookings.length}x</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Phone size={10} />{c.phone}</span>
                      {c.email !== '—' && <span className="flex items-center gap-1 text-xs text-gray-400"><Mail size={10} />{c.email}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge status={c.bookings[c.bookings.length-1]?.status} />
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(c.lastContact).toLocaleDateString()}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {selected && (
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm sticky top-8">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-heading font-semibold text-brand-navy">Customer Detail</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700"><X size={16} /></button>
              </div>
              <div className="px-5 py-5 border-b border-gray-100 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-navy flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl font-bold">{selected.name?.[0]?.toUpperCase()}</span>
                </div>
                <h4 className="font-heading font-bold text-brand-navy text-base">{selected.name}</h4>
                {selected.bookings.length > 1 && (
                  <span className="text-xs font-bold bg-brand-gold/20 text-yellow-700 px-2.5 py-1 rounded-full mt-1 inline-block">
                    Repeat Customer · {selected.bookings.length} bookings
                  </span>
                )}
              </div>
              <div className="px-5 py-4 space-y-3 border-b border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Contact Info</p>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={14} className="text-gray-400 flex-shrink-0" />
                  <a href={`tel:${selected.phone}`} className="text-brand-navy hover:text-brand-red transition-colors font-medium">{selected.phone}</a>
                </div>
                {selected.email !== '—' && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={14} className="text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${selected.email}`} className="text-brand-navy hover:text-brand-red transition-colors font-medium truncate">{selected.email}</a>
                  </div>
                )}
                {selected.location !== '—' && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{selected.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500 text-xs">First contact: {new Date(selected.firstContact).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Booking History ({selected.bookings.length})</p>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {selected.bookings.map((b: any, i: number) => (
                    <div key={b._id||i} className="bg-gray-50 rounded-sm p-3 border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-brand-navy">{b.service}</span>
                        <Badge status={b.status} />
                      </div>
                      {b.message && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{b.message}</p>}
                      <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1"><Calendar size={9} />{new Date(b.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
                <a href={`tel:${selected.phone}`} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white py-2.5 rounded-sm transition-all">
                  <Phone size={12} /> Call
                </a>
                {selected.email !== '—' && (
                  <a href={`mailto:${selected.email}`} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold border border-gray-200 text-gray-600 hover:border-brand-navy hover:text-brand-navy py-2.5 rounded-sm transition-all">
                    <Mail size={12} /> Email
                  </a>
                )}
                <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold border border-green-200 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 py-2.5 rounded-sm transition-all">
                  WA
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── OVERVIEW ────────────────────────────────────────────────────────────────
function OverviewPanel({ bookings, properties, projects, gallery, customers, setPanel }: any) {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-brand-navy mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { l:'New Bookings',   v:bookings.filter((b:any)=>b.status==='new').length, cl:'border-brand-red',  icon:ClipboardList, p:'bookings' },
          { l:'Customers',      v:customers.length,   cl:'border-brand-navy', icon:Users,   p:'customers' },
          { l:'Projects',       v:projects.length,    cl:'border-blue-500',   icon:Package, p:'projects' },
          { l:'Gallery Photos', v:gallery.length,     cl:'border-green-500',  icon:Camera,  p:'gallery' },
        ].map(s => (
          <button key={s.l} onClick={() => setPanel(s.p)}
            className={`bg-white border border-gray-200 hover:border-gray-300 rounded-sm p-5 text-left border-l-4 ${s.cl} transition-all hover:-translate-y-0.5 shadow-sm`}>
            <s.icon size={18} className="text-gray-400 mb-3" />
            <p className="font-heading text-3xl font-bold text-brand-navy">{s.v}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1">{s.l}</p>
          </button>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-brand-navy">Recent Bookings</h2>
          <button onClick={() => setPanel('bookings')} className="text-xs text-brand-red hover:underline flex items-center gap-1">View all <ChevronRight size={12} /></button>
        </div>
        <Tbl
          headers={['Name','Phone','Service','Date','Status']}
          rows={bookings.slice(0,8).map((b:any) => [
            <span className="font-medium text-brand-navy">{b.name}</span>,
            b.phone, b.service,
            <span className="text-gray-400 text-xs">{new Date(b.createdAt).toLocaleDateString()}</span>,
            <Badge status={b.status} />,
          ])}
        />
      </div>
    </div>
  )
}

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
function BookingsPanel({ data, setData, showToast }: any) {
  const handle = async (id: string, action: string) => {
    try {
      if (action === 'delete') {
        if (!confirm('Delete?')) return
        await deleteBooking(id); setData((d:any[]) => d.filter(x => x._id !== id)); showToast('Deleted')
      } else {
        await updateBookingStatus(id, action)
        setData((d:any[]) => d.map(x => x._id===id ? {...x, status:action} : x))
        showToast('Updated')
      }
    } catch { showToast('Failed','error') }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-brand-navy mb-6">Bookings ({data.length})</h1>
      <Tbl
        headers={['Name','Phone','Email','Service','Location','Message','Date','Status','Actions']}
        rows={data.map((b:any) => [
          <span className="font-medium text-brand-navy">{b.name}</span>,
          b.phone, b.email||'—', b.service, b.location||'—',
          <span className="text-gray-400 max-w-[120px] truncate block">{b.message||'—'}</span>,
          <span className="text-gray-400 text-xs">{new Date(b.createdAt).toLocaleDateString()}</span>,
          <Badge status={b.status} />,
          <div className="flex gap-1.5">
            <button onClick={() => handle(b._id,'contacted')} className="text-xs border border-green-200 text-green-700 hover:bg-green-50 px-2.5 py-1.5 rounded-sm transition-colors">Contacted</button>
            <ABtn onClick={() => handle(b._id,'delete')} icon={Trash2} danger />
          </div>,
        ])}
      />
    </div>
  )
}

// ─── PROPERTIES ──────────────────────────────────────────────────────────────
function PropertiesPanel({ data, setData, showToast }: any) {
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState<any>(null)
  const [saving,   setSaving]   = useState(false)
  const [form,     setForm]     = useState<any>({ title:'',price:'',type:'house',status:'sale',location:'',bedrooms:'',bathrooms:'',area:'',description:'',featured:false })
  const [files,    setFiles]    = useState<File[]>([])

  const openNew  = () => { setEditing(null); setForm({title:'',price:'',type:'house',status:'sale',location:'',bedrooms:'',bathrooms:'',area:'',description:'',featured:false}); setFiles([]); setShowForm(true) }
  const openEdit = (p:any) => { setEditing(p); setForm({title:p.title,price:p.price,type:p.type,status:p.status,location:p.location,bedrooms:p.bedrooms||'',bathrooms:p.bathrooms||'',area:p.area||'',description:p.description||'',featured:!!p.featured}); setFiles([]); setShowForm(true) }

  const save = async (e:React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k, String(v)))
      files.forEach(f => fd.append('images', f))
      if (editing) {
        const u = await updateProperty(editing._id, fd)
        setData((d:any[]) => d.map(x => x._id===editing._id ? u : x)); showToast('Updated')
      } else {
        const c = await createProperty(fd)
        setData((d:any[]) => [c,...d]); showToast('Created')
      }
      setShowForm(false)
    } catch { showToast('Failed','error') } finally { setSaving(false) }
  }

  const del = async (id:string) => {
    if (!confirm('Delete?')) return
    try { await deleteProperty(id); setData((d:any[]) => d.filter(x=>x._id!==id)); showToast('Deleted') }
    catch { showToast('Failed','error') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-navy">Properties ({data.length})</h1>
        <button onClick={openNew} className="btn-primary text-xs py-2.5"><Plus size={14} />Add Property</button>
      </div>
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-brand-navy text-lg">{editing?'Edit':'New'} Property</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
          </div>
          <form onSubmit={save}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2"><Fld label="Title *"><input className={inp} required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></Fld></div>
              <Fld label="Price (TZS) *"><input className={inp} type="number" required value={form.price} onChange={e=>setForm({...form,price:e.target.value})} /></Fld>
              <Fld label="Type"><select className={sel} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{['house','apartment','land','commercial'].map(t=><option key={t}>{t}</option>)}</select></Fld>
              <Fld label="Status"><select className={sel} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="sale">For Sale</option><option value="rent">For Rent</option></select></Fld>
              <Fld label="Location *"><input className={inp} required value={form.location} onChange={e=>setForm({...form,location:e.target.value})} /></Fld>
              <Fld label="Bedrooms"><input className={inp} type="number" value={form.bedrooms} onChange={e=>setForm({...form,bedrooms:e.target.value})} /></Fld>
              <Fld label="Bathrooms"><input className={inp} type="number" value={form.bathrooms} onChange={e=>setForm({...form,bathrooms:e.target.value})} /></Fld>
              <Fld label="Area (m²)"><input className={inp} type="number" value={form.area} onChange={e=>setForm({...form,area:e.target.value})} /></Fld>
              <div className="col-span-2"><Fld label="Description"><textarea className={ta} rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></Fld></div>
              <div className="col-span-2">
                <Fld label="Images">
                  <div className="border-2 border-dashed border-gray-200 hover:border-brand-navy rounded-sm p-5 text-center cursor-pointer transition-colors relative">
                    <ImageIcon size={24} className="text-gray-300 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Click to upload property images</p>
                    {files.length > 0 && <p className="text-xs text-brand-navy font-medium mt-1">{files.length} file(s) selected</p>}
                    <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>setFiles(Array.from(e.target.files||[]))} />
                  </div>
                </Fld>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} className="w-4 h-4 accent-brand-red" />
                <span className="text-sm text-gray-600 font-medium">Featured Property</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button type="submit" disabled={saving} className="btn-primary text-xs py-2.5 disabled:opacity-50">
                {saving?<><Loader size={13} className="animate-spin"/>Saving...</>:'Save Property'}
              </button>
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2.5 border border-gray-200 text-gray-500 hover:text-gray-800 text-xs rounded-sm transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <Tbl
        headers={['Image','Title','Price','Type','Status','Location','Featured','Actions']}
        rows={data.map((p:any) => {
          const img = p.images?.[0] ? `${API}/uploads/${p.images[0]}` : null
          return [
            img ? <img src={img} className="w-12 h-10 object-cover rounded-sm border border-gray-200" alt="" />
                : <div className="w-12 h-10 bg-gray-100 rounded-sm flex items-center justify-center"><ImageIcon size={14} className="text-gray-300" /></div>,
            <span className="font-medium text-brand-navy max-w-[160px] truncate block">{p.title}</span>,
            `TZS ${Number(p.price).toLocaleString()}`,
            <span className="capitalize">{p.type}</span>,
            <Badge status={p.status} />,
            p.location,
            p.featured ? <span className="text-xs text-brand-gold font-bold">Yes</span> : '—',
            <div className="flex gap-1.5"><ABtn onClick={()=>openEdit(p)} icon={Edit2} /><ABtn onClick={()=>del(p._id)} icon={Trash2} danger /></div>,
          ]
        })}
      />
    </div>
  )
}

// ─── SIMPLE PANEL ────────────────────────────────────────────────────────────
function SimplePanel({ title, data, setData, showToast, fields, createFn, updateFn, deleteFn, withImages }: any) {
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState<any>(null)
  const [saving,   setSaving]   = useState(false)
  const [form,     setForm]     = useState<any>({})
  const [file,     setFile]     = useState<File|null>(null)
  const [files,    setFiles]    = useState<File[]>([])

  const empty    = fields.reduce((a:any,f:any) => ({...a,[f.k]:f.def??''}),{})
  const openNew  = () => { setEditing(null); setForm(empty); setFile(null); setFiles([]); setShowForm(true) }
  const openEdit = (item:any) => { setEditing(item); setForm(fields.reduce((a:any,f:any)=>({...a,[f.k]:item[f.k]??f.def??''}),{})); setFile(null); setFiles([]); setShowForm(true) }

  const save = async (e:React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      let payload: any = form
      if (withImages === 'single') { const fd = new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,String(v))); if(file) fd.append('image',file); payload=fd }
      else if (withImages === 'multi')  { const fd = new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,String(v))); files.forEach(f2=>fd.append('images',f2)); payload=fd }
      else if (withImages === 'photo')  { const fd = new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,String(v))); if(file) fd.append('photo',file); payload=fd }
      if (editing) {
        const u = await updateFn(editing._id, payload)
        setData((d:any[]) => d.map(x => x._id===editing._id ? u : x)); showToast(`${title} updated`)
      } else {
        const c = await createFn(payload)
        setData((d:any[]) => [c,...d]); showToast(`${title} created`)
      }
      setShowForm(false)
    } catch { showToast('Failed to save','error') } finally { setSaving(false) }
  }

  const del = async (id:string) => {
    if (!confirm('Delete?')) return
    try { await deleteFn(id); setData((d:any[])=>d.filter(x=>x._id!==id)); showToast('Deleted') }
    catch { showToast('Failed','error') }
  }

  const vFields = fields.filter((f:any) => !f.hide)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-navy">{title}s ({data.length})</h1>
        <button onClick={openNew} className="btn-primary text-xs py-2.5"><Plus size={14} />Add {title}</button>
      </div>
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-brand-navy text-lg">{editing?'Edit':'New'} {title}</h2>
            <button onClick={()=>setShowForm(false)}><X size={18} className="text-gray-400" /></button>
          </div>
          <form onSubmit={save}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {fields.map((f:any) => (
                <div key={f.k} className={f.full?'col-span-2':''}>
                  <Fld label={`${f.l}${f.req?' *':''}`}>
                    {f.ta ? <textarea className={ta} rows={3} required={f.req} placeholder={f.ph} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} />
                    : f.sel ? <select className={sel} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}>{f.sel.map((o:string)=><option key={o}>{o}</option>)}</select>
                    : <input className={inp} type={f.type||'text'} required={f.req} placeholder={f.ph} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} />}
                  </Fld>
                </div>
              ))}
              {withImages && (
                <div className="col-span-2">
                  <Fld label={withImages==='multi'?'Images':'Photo / Image'}>
                    <div className="border-2 border-dashed border-gray-200 hover:border-brand-navy rounded-sm p-5 text-center cursor-pointer relative transition-colors">
                      <ImageIcon size={22} className="text-gray-300 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Upload {withImages==='multi'?'multiple images':'an image'}</p>
                      {(file||files.length>0) && <p className="text-xs text-brand-navy mt-1 font-medium">{withImages==='multi'?`${files.length} files selected`:file?.name}</p>}
                      <input type="file" accept="image/*" multiple={withImages==='multi'} className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={e=>{ if(withImages==='multi') setFiles(Array.from(e.target.files||[])); else setFile(e.target.files?.[0]||null) }} />
                    </div>
                  </Fld>
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button type="submit" disabled={saving} className="btn-primary text-xs py-2.5 disabled:opacity-50">
                {saving?<><Loader size={13} className="animate-spin"/>Saving...</>:`Save ${title}`}
              </button>
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2.5 border border-gray-200 text-gray-500 text-xs rounded-sm hover:text-gray-800 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <Tbl
        headers={[...vFields.map((f:any)=>f.l),'Actions']}
        rows={data.map((item:any) => [
          ...vFields.map((f:any) => {
            const v = item[f.k]
            if (f.badge)      return <Badge status={v} />
            if (f.stars)      return <span className="text-brand-gold">{'★'.repeat(Number(v)||5)}</span>
            if (f.ta||f.full) return <span className="text-gray-500 max-w-[180px] truncate block">{String(v||'—')}</span>
            return <span className={f.bold?'font-medium text-brand-navy':''}>{String(v??'—')}</span>
          }),
          <div className="flex gap-1.5"><ABtn onClick={()=>openEdit(item)} icon={Edit2} /><ABtn onClick={()=>del(item._id)} icon={Trash2} danger /></div>,
        ])}
      />
    </div>
  )
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────
function GalleryPanel({ data, setData, showToast }: any) {
  const [saving, setSaving] = useState(false)
  const [form,   setForm]   = useState({ title:'', category:'Projects' })
  const [file,   setFile]   = useState<File|null>(null)

  const save = async (e:React.FormEvent) => {
    e.preventDefault()
    if (!file) { showToast('Please select an image','error'); return }
    setSaving(true)
    try {
      const fd = new FormData(); fd.append('title',form.title); fd.append('category',form.category); fd.append('image',file)
      const c = await createGallery(fd); setData((d:any[])=>[c,...d]); showToast('Photo added')
      setForm({title:'',category:'Projects'}); setFile(null)
    } catch { showToast('Failed','error') } finally { setSaving(false) }
  }

  const del = async (id:string) => {
    if (!confirm('Delete photo?')) return
    try { await deleteGallery(id); setData((d:any[])=>d.filter(x=>x._id!==id)); showToast('Deleted') }
    catch { showToast('Failed','error') }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-brand-navy mb-6">Gallery ({data.length} photos)</h1>
      <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6 shadow-sm">
        <h2 className="font-heading font-semibold text-brand-navy mb-4">Upload Photo</h2>
        <form onSubmit={save} className="grid grid-cols-3 gap-4 items-end">
          <Fld label="Title"><input className={inp} placeholder="Photo caption..." value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></Fld>
          <Fld label="Category">
            <select className={sel} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {['Projects','Paving','Team','Activities','Equipment','General'].map(c=><option key={c}>{c}</option>)}
            </select>
          </Fld>
          <Fld label="Image *">
            <div className="relative border-2 border-dashed border-gray-200 hover:border-brand-navy rounded-sm p-3 text-center cursor-pointer transition-colors">
              <p className="text-xs text-gray-400">{file?file.name:'Click to select'}</p>
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>setFile(e.target.files?.[0]||null)} />
            </div>
          </Fld>
          <div className="col-span-3">
            <button type="submit" disabled={saving||!file} className="btn-primary text-xs py-2.5 disabled:opacity-50">
              {saving?<><Loader size={13} className="animate-spin"/>Uploading...</>:<><Plus size={14}/>Add Photo</>}
            </button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {data.map((item:any) => {
          const img = item.image?.startsWith('http') ? item.image : `${API}/uploads/${item.image}`
          return (
            <div key={item._id} className="relative group">
              <div className="h-28 rounded-sm overflow-hidden border border-gray-100">
                <img src={img} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 truncate font-medium">{item.title||'—'}</p>
                  <p className="text-[10px] text-gray-400">{item.category}</p>
                </div>
                <button onClick={()=>del(item._id)} className="p-1 hover:text-brand-red transition-colors text-gray-300 flex-shrink-0"><Trash2 size={12} /></button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── CERTIFICATES PANEL ───────────────────────────────────────────────────────
function CertificatesPanel({ data, setData, showToast }: any) {
  const [saving,   setSaving]  = useState(false)
  const [editing,  setEditing] = useState<any>(null)
  const [showForm, setShowForm]= useState(false)
  const [form,     setForm]    = useState({ label:'', detail:'', sub:'', order:'0' })
  const [file,     setFile]    = useState<File|null>(null)

  const defaultCerts = [
    { label:'CRB Certificate',     detail:'B5/1691/11/2023', sub:'Class 5 Building Works',     order:0 },
    { label:'Company Registration', detail:'No. 58147',       sub:'Registered Nov 2023',         order:1 },
    { label:'TIN Registration',     detail:'106-957-053',     sub:'Tanzania Revenue Authority',  order:2 },
    { label:'VAT Registration',     detail:'40-045251-B',     sub:'VAT Registered Feb 2022',     order:3 },
  ]

  const openNew  = () => { setEditing(null); setForm({label:'',detail:'',sub:'',order:'0'}); setFile(null); setShowForm(true) }
  const openEdit = (c:any) => { setEditing(c); setForm({label:c.label,detail:c.detail||'',sub:c.sub||'',order:String(c.order||0)}); setFile(null); setShowForm(true) }

  const save = async (e:React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      fd.append('label', form.label); fd.append('detail', form.detail)
      fd.append('sub',   form.sub);   fd.append('order',  form.order)
      if (file) fd.append('image', file)
      if (editing) {
        const u = await updateCertificate(editing._id, fd)
        setData((d:any[]) => d.map(x => x._id===editing._id ? u : x)); showToast('Certificate updated')
      } else {
        const c = await createCertificate(fd)
        setData((d:any[]) => [...d, c]); showToast('Certificate added')
      }
      setShowForm(false)
    } catch { showToast('Failed to save','error') } finally { setSaving(false) }
  }

  const del = async (id:string) => {
    if (!confirm('Delete this certificate?')) return
    try { await deleteCertificate(id); setData((d:any[])=>d.filter(x=>x._id!==id)); showToast('Deleted') }
    catch { showToast('Failed','error') }
  }

  const seedDefaults = async () => {
    setSaving(true)
    try {
      for (const cert of defaultCerts) {
        const fd = new FormData()
        Object.entries(cert).forEach(([k,v]) => fd.append(k, String(v)))
        const c = await createCertificate(fd)
        setData((d:any[]) => [...d, c])
      }
      showToast('Default certificates added — now upload images for each one')
    } catch { showToast('Failed to seed','error') } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-navy">Certificates <span className="text-gray-400 font-normal text-lg">({data.length})</span></h1>
          <p className="text-sm text-gray-400 mt-0.5">Upload scanned certificates shown in the About Us page</p>
        </div>
        <div className="flex gap-2">
          {data.length === 0 && (
            <button onClick={seedDefaults} disabled={saving}
              className="border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white text-xs font-semibold px-4 py-2.5 rounded-sm transition-all disabled:opacity-50">
              {saving ? 'Adding...' : 'Seed Defaults'}
            </button>
          )}
          <button onClick={openNew} className="btn-primary text-xs py-2.5"><Plus size={14} />Add Certificate</button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-sm px-4 py-3 mb-6 text-sm text-blue-700">
        <strong>How to use:</strong> Click <em>"Seed Defaults"</em> to add the 4 standard entries (CRB, Company Reg, TIN, VAT),
        then click <em>Edit</em> on each to upload the scanned certificate image. Images appear on the{' '}
        <a href="/about" target="_blank" className="underline">About Us</a> page with click-to-zoom.
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-brand-navy text-lg">{editing ? 'Edit Certificate' : 'Add Certificate'}</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
          </div>
          <form onSubmit={save}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Fld label="Label *">
                <input className={inp} required placeholder="e.g. CRB Certificate" value={form.label} onChange={e=>setForm({...form,label:e.target.value})} />
              </Fld>
              <Fld label="Reference Number">
                <input className={inp} placeholder="e.g. B5/1691/11/2023" value={form.detail} onChange={e=>setForm({...form,detail:e.target.value})} />
              </Fld>
              <Fld label="Subtitle">
                <input className={inp} placeholder="e.g. Class 5 Building Works" value={form.sub} onChange={e=>setForm({...form,sub:e.target.value})} />
              </Fld>
              <Fld label="Display Order">
                <input className={inp} type="number" value={form.order} onChange={e=>setForm({...form,order:e.target.value})} />
              </Fld>
              <div className="col-span-2">
                <Fld label="Certificate Image (scan / photo)">
                  <div className="border-2 border-dashed border-gray-200 hover:border-brand-navy rounded-sm p-6 text-center cursor-pointer transition-colors relative">
                    {editing?.image && !file && (
                      <div className="mb-3">
                        <img src={`${API}/uploads/${editing.image}`} alt="Current" className="h-20 object-contain mx-auto rounded-sm border border-gray-200" />
                        <p className="text-xs text-gray-400 mt-1">Current — upload new to replace</p>
                      </div>
                    )}
                    <ImageIcon size={24} className="text-gray-300 mx-auto mb-1.5" />
                    {file
                      ? <p className="text-sm text-brand-navy font-medium">{file.name}</p>
                      : <p className="text-sm text-gray-400">Click to upload JPG, PNG or PDF screenshot</p>
                    }
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>setFile(e.target.files?.[0]||null)} />
                  </div>
                </Fld>
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button type="submit" disabled={saving} className="btn-primary text-xs py-2.5 disabled:opacity-50">
                {saving?<><Loader size={13} className="animate-spin"/>Saving...</>:'Save Certificate'}
              </button>
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2.5 border border-gray-200 text-gray-500 text-xs rounded-sm hover:text-gray-800 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {data.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-sm">
          <Award size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No certificates yet. Click "Seed Defaults" to add the standard 4.</p>
          <button onClick={seedDefaults} disabled={saving} className="btn-primary text-xs py-2.5">Seed Default Certificates</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.map((cert:any) => {
            const imgUrl = cert.image ? `${API}/uploads/${cert.image}` : null
            return (
              <div key={cert._id} className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                <div className="h-40 bg-gray-50 border-b border-gray-100 relative flex items-center justify-center">
                  {imgUrl
                    ? <img src={imgUrl} alt={cert.label} className="w-full h-full object-contain p-2" />
                    : <div className="text-center"><ImageIcon size={28} className="text-gray-200 mx-auto mb-1" /><p className="text-xs text-gray-300">No image</p></div>
                  }
                  <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${imgUrl ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                    {imgUrl ? '✓ Uploaded' : 'No image'}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-0.5">{cert.label}</p>
                  <p className="text-sm font-semibold text-brand-navy">{cert.detail||'—'}</p>
                  <p className="text-xs text-gray-400 mt-0.5 mb-3">{cert.sub||'—'}</p>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(cert)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white px-3 py-2 rounded-sm transition-all">
                      <Edit2 size={11} />{imgUrl ? 'Replace Image' : 'Upload Image'}
                    </button>
                    <button onClick={() => del(cert._id)}
                      className="p-2 border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 rounded-sm transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── HOMEPAGE ────────────────────────────────────────────────────────────────
function HomepagePanel({ homepage, setHomepage, showToast }: any) {
  const [form,          setForm]          = useState(homepage)
  const [saving,        setSaving]        = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoPreview,   setLogoPreview]   = useState<string|null>(null)

  useEffect(() => { setForm(homepage) }, [homepage])

  const savedLogoUrl = homepage?.logoFilename ? `${API}/uploads/${homepage.logoFilename}` : null

  const save = async (e:React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try { const u=await updateHomepageSettings(form); setHomepage(u); showToast('Settings saved!') }
    catch { showToast('Failed','error') } finally { setSaving(false) }
  }

  const handleLogoUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onload = ev => setLogoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    setLogoUploading(true)
    try {
      const fd = new FormData(); fd.append('logo', file)
      const token = localStorage.getItem('kifaru_token')
      const r    = await fetch(`${API}/api/settings/logo`, { method:'POST', headers:{ Authorization:`Bearer ${token}` }, body:fd })
      const data = await r.json()
      if (r.ok) {
        const updated = await updateHomepageSettings({ ...form, logoFilename: data.filename })
        setHomepage(updated); setForm(updated); showToast('Logo uploaded!')
      } else { showToast(data.error||'Upload failed','error'); setLogoPreview(null) }
    } catch { showToast('Upload failed','error'); setLogoPreview(null) }
    finally { setLogoUploading(false) }
  }

  const F = ({ label, k, isTA=false }: any) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
      {isTA
        ? <textarea className={`${ta} min-h-[70px]`} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} />
        : <input className={inp} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} />}
    </div>
  )

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-brand-navy mb-6">Homepage Settings</h1>
      <form onSubmit={save} className="space-y-6 max-w-3xl">
        <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-brand-navy mb-5 pb-2 border-b border-gray-100">Hero Section</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><F label="Hero Badge Text" k="heroBadge" /></div>
            <div className="col-span-2"><F label="Hero Title" k="heroTitle" isTA /></div>
            <div className="col-span-2"><F label="Hero Subtitle" k="heroSubtitle" isTA /></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-brand-navy mb-5 pb-2 border-b border-gray-100">Statistics Bar</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <F label="Years Experience"  k="statYears" />
            <F label="Projects Completed" k="statProjects" />
            <F label="Cities Covered"    k="statCities" />
            <F label="Happy Clients"     k="statClients" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-brand-navy mb-3 pb-2 border-b border-gray-100">Company Logo</h3>
          <p className="text-sm text-gray-500 mb-4">PNG with transparent background recommended. Saves automatically on upload.</p>
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Current</p>
              <div className="w-36 h-16 border-2 border-gray-100 rounded-sm bg-gray-50 flex items-center justify-center overflow-hidden">
                {logoPreview
                  ? <img src={logoPreview} alt="Preview" className="max-w-full max-h-full object-contain p-1" />
                  : savedLogoUrl
                  ? <img src={`${savedLogoUrl}?t=${Date.now()}`} alt="Logo" className="max-w-full max-h-full object-contain p-1" onError={e=>{(e.target as HTMLImageElement).style.display='none'}} />
                  : <div className="text-center"><ImageIcon size={20} className="text-gray-300 mx-auto mb-1" /><p className="text-[10px] text-gray-400">No logo</p></div>
                }
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Upload New</p>
              <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-sm p-6 cursor-pointer transition-colors ${logoUploading?'border-brand-gold bg-yellow-50 cursor-not-allowed':'border-gray-200 hover:border-brand-navy'}`}>
                {logoUploading
                  ? <><Loader size={20} className="text-brand-gold animate-spin" /><span className="text-sm text-gray-500">Uploading...</span></>
                  : <><ImageIcon size={20} className="text-gray-400" /><span className="text-sm text-gray-500 font-medium">Click to upload logo</span><span className="text-xs text-gray-400">PNG, SVG or WebP</span></>
                }
                <input type="file" accept="image/*,.svg" className="hidden" disabled={logoUploading}
                  onChange={e=>{ const f=e.target.files?.[0]; if(f) handleLogoUpload(f); e.target.value='' }} />
              </label>
            </div>
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50 py-3 px-8">
          {saving?<><Loader size={14} className="animate-spin"/>Saving...</>:'Save Settings'}
        </button>
      </form>
    </div>
  )
}