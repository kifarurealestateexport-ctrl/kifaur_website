'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Building2, ClipboardList, Briefcase, Package,
  Star, Home, Users, Settings, LogOut, Plus, Edit2, Trash2, X,
  CheckCircle, AlertCircle, Loader, ChevronRight, Image as ImageIcon,
  RefreshCw, Wrench, Camera, UserCheck, Award, Phone, Mail, MapPin,
  Calendar, Search, Filter, Download, ArrowLeft, Eye, EyeOff, Lock,
  User, Bell, Tag, Globe
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
  getOffers, createOffer, updateOffer, deleteOffer,
  getClientLogos, createClientLogo, updateClientLogo, deleteClientLogo,
} from '@/lib/api'

type Panel = 'overview'|'bookings'|'customers'|'properties'|'services'|'projects'|'testimonials'|'floorplans'|'agents'|'equipment'|'gallery'|'team'|'certificates'|'homepage'

const API = process.env.NEXT_PUBLIC_API_URL?.replace('/api','') || 'http://localhost:5001'
const inp = 'w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-navy transition-colors'
const sel = `${inp} cursor-pointer`
const ta  = `${inp} resize-none`
const btn = 'btn-primary text-xs py-2.5'

// ─── TINY HELPERS ─────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-sm shadow-xl text-sm font-medium border ${type==='success'?'bg-green-50 border-green-200 text-green-800':'bg-red-50 border-red-200 text-red-800'}`}>
      {type==='success'?<CheckCircle size={16} className="text-green-500"/>:<AlertCircle size={16} className="text-red-500"/>}
      {msg}<button onClick={onClose}><X size={14}/></button>
    </div>
  )
}

function Badge({ status }: { status: string }) {
  const s: Record<string,string> = { new:'bg-blue-100 text-blue-700', contacted:'bg-green-100 text-green-700', closed:'bg-gray-100 text-gray-500', Completed:'bg-green-100 text-green-700', Ongoing:'bg-yellow-100 text-yellow-700', sale:'bg-red-100 text-red-700', rent:'bg-blue-100 text-blue-700' }
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${s[status]||'bg-gray-100 text-gray-500'}`}>{status}</span>
}

function ABtn({ onClick, icon: Icon, danger }: any) {
  return <button onClick={onClick} className={`p-1.5 rounded-sm border transition-all ${danger?'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50':'border-gray-200 text-gray-400 hover:border-brand-navy hover:text-brand-navy hover:bg-blue-50'}`}><Icon size={13}/></button>
}

function Tbl({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-sm border border-gray-200">
      <table className="w-full text-sm">
        <thead><tr className="bg-brand-navy text-white">{headers.map(h=><th key={h} className="text-left py-3 px-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-gray-100">
          {rows.length===0?<tr><td colSpan={headers.length} className="text-center text-gray-400 py-12 text-sm">No records yet</td></tr>
            :rows.map((row,i)=><tr key={i} className="hover:bg-gray-50 transition-colors">{row.map((cell,j)=><td key={j} className="py-3 px-4 text-gray-600 whitespace-nowrap">{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  )
}

function Fld({ label, children }: any) {
  return <div><label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>{children}</div>
}

function ImgUpload({ label, multiple, file, files, onFile, onFiles, current }: any) {
  return (
    <Fld label={label||'Image'}>
      <div className="border-2 border-dashed border-gray-200 hover:border-brand-navy rounded-sm p-5 text-center cursor-pointer relative transition-colors">
        {current && !file && !files?.length && <img src={current} alt="" className="h-16 object-contain mx-auto mb-2 rounded-sm border border-gray-200"/>}
        <ImageIcon size={22} className="text-gray-300 mx-auto mb-1"/>
        <p className="text-xs text-gray-400">{multiple?`${files?.length||0} file(s) selected`:(file?.name||'Click to upload')}</p>
        <input type="file" accept="image/*" multiple={!!multiple} className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={e=>multiple?onFiles?.(Array.from(e.target.files||[])):onFile?.(e.target.files?.[0]||null)}/>
      </div>
    </Fld>
  )
}

function deriveCustomers(bookings: any[]) {
  const map = new Map<string,any>()
  bookings.forEach(b => {
    const key = b.phone||b.email||b.name; if (!key) return
    if (map.has(key)) { const e=map.get(key); e.bookings.push(b); e.lastContact=new Date(b.createdAt)>new Date(e.lastContact)?b.createdAt:e.lastContact }
    else map.set(key,{id:key,name:b.name,phone:b.phone||'—',email:b.email||'—',location:b.location||'—',firstContact:b.createdAt,lastContact:b.createdAt,bookings:[b]})
  })
  return Array.from(map.values()).sort((a,b)=>new Date(b.lastContact).getTime()-new Date(a.lastContact).getTime())
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed,setAuthed]   = useState(false)
  const [lFrm,setLFrm]       = useState({username:'admin',password:''})
  const [lErr,setLErr]       = useState('')
  const [lLd,setLLd]         = useState(false)
  const [showPw,setShowPw]   = useState(false)
  const [panel,setPanel]     = useState<Panel>('overview')
  const [toast,setToast]     = useState<any>(null)
  const [loading,setLoading] = useState(false)

  const [bookings,setBookings]         = useState<any[]>([])
  const [properties,setProperties]     = useState<any[]>([])
  const [services,setServices]         = useState<any[]>([])
  const [projects,setProjects]         = useState<any[]>([])
  const [testimonials,setTestimonials] = useState<any[]>([])
  const [floorplans,setFloorplans]     = useState<any[]>([])
  const [agents,setAgents]             = useState<any[]>([])
  const [equipment,setEquipment]       = useState<any[]>([])
  const [gallery,setGallery]           = useState<any[]>([])
  const [team,setTeam]                 = useState<any[]>([])
  const [certificates,setCertificates] = useState<any[]>([])
  const [offers,setOffers]             = useState<any[]>([])
  const [clientLogos,setClientLogos]   = useState<any[]>([])
  const [homepage,setHomepage]         = useState<any>({})

  const showToast = (msg: string, type='success') => setToast({msg,type})

  useEffect(()=>{ if(typeof window!=='undefined'&&localStorage.getItem('kifaru_token')) setAuthed(true) },[])
  useEffect(()=>{ if(authed) loadAll() },[authed])

  const loadAll = async () => {
    setLoading(true)
    const r = await Promise.allSettled([
      getBookings(),getProperties(),getServices(),getProjects(),
      getTestimonials(),getFloorPlans(),getAgents(),getEquipment(),
      getGallery(),getTeam(),getCertificates(),getHomepageSettings(),
      getOffers(),getClientLogos(),
    ])
    const [b,p,s,pr,t,f,a,eq,g,tm,certs,h,of,cl] = r
    if(b.status==='fulfilled')     setBookings(b.value.bookings||b.value||[])
    if(p.status==='fulfilled')     setProperties(p.value.properties||p.value||[])
    if(s.status==='fulfilled')     setServices(s.value||[])
    if(pr.status==='fulfilled')    setProjects(pr.value||[])
    if(t.status==='fulfilled')     setTestimonials(t.value||[])
    if(f.status==='fulfilled')     setFloorplans(f.value||[])
    if(a.status==='fulfilled')     setAgents(a.value||[])
    if(eq.status==='fulfilled')    setEquipment(eq.value||[])
    if(g.status==='fulfilled')     setGallery(g.value||[])
    if(tm.status==='fulfilled')    setTeam(tm.value||[])
    if(certs.status==='fulfilled') setCertificates(certs.value||[])
    if(h.status==='fulfilled')     setHomepage(h.value||{})
    if(of.status==='fulfilled')    setOffers(of.value||[])
    if(cl.status==='fulfilled')    setClientLogos(cl.value||[])
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLLd(true); setLErr('')
    try { const d=await adminLogin(lFrm); localStorage.setItem('kifaru_token',d.token); setAuthed(true) }
    catch { setLErr('Invalid username or password.') } finally { setLLd(false) }
  }

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-brand-navy via-red-600 to-brand-navy"/>
          <div className="px-8 pt-8 pb-9">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-brand-navy">
                <img src={`${API}/uploads/logo.png`} alt="Kifaru" className="h-10 w-auto object-contain" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
              </div>
              <div><h2 className="font-heading text-xl font-bold text-gray-900">KIFARU Admin</h2><p className="text-gray-400 text-xs">Sign in to your dashboard</p></div>
            </div>
            {lErr&&<div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5"><AlertCircle size={15}/>{lErr}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><User size={15}/></div>
                <input className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-navy transition-all" placeholder="Username" value={lFrm.username} onChange={e=>setLFrm({...lFrm,username:e.target.value})}/>
              </div>
              <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={15}/></div>
                <input className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-navy transition-all" type={showPw?'text':'password'} placeholder="Password" value={lFrm.password} onChange={e=>setLFrm({...lFrm,password:e.target.value})}/>
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">{showPw?<EyeOff size={15}/>:<Eye size={15}/>}</button>
              </div>
              <button type="submit" disabled={lLd} className="w-full flex items-center justify-center gap-2 bg-brand-navy text-white font-bold text-sm py-3.5 rounded-xl transition-all disabled:opacity-60">
                {lLd?<><Loader size={15} className="animate-spin"/>Signing in...</>:'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )

  const customers = deriveCustomers(bookings)

  const navGroups = [
    { label:'Main', items:[
      {id:'overview',label:'Overview',icon:LayoutDashboard},
      {id:'bookings',label:'Bookings',icon:ClipboardList,count:bookings.filter((b:any)=>b.status==='new').length},
      {id:'customers',label:'Customers',icon:Users,count:customers.length},
    ]},
    { label:'Real Estate', items:[
      {id:'properties',label:'Properties',icon:Building2,count:properties.length},
      {id:'floorplans',label:'Floor Plans',icon:Home,count:floorplans.length},
      {id:'agents',label:'Agents',icon:Users,count:agents.length},
    ]},
    { label:'Construction', items:[
      {id:'services',label:'Services',icon:Briefcase,count:services.length},
      {id:'projects',label:'Projects',icon:Package,count:projects.length},
      {id:'equipment',label:'Equipment',icon:Wrench,count:equipment.length},
    ]},
    { label:'Content', items:[
      {id:'gallery',label:'Gallery',icon:Camera,count:gallery.length},
      {id:'testimonials',label:'Testimonials',icon:Star,count:testimonials.length},
      {id:'team',label:'Team',icon:UserCheck,count:team.length},
      {id:'certificates',label:'Certificates',icon:Award,count:certificates.length},
    ]},
    { label:'Settings', items:[
      {id:'homepage',label:'Homepage & Content',icon:Settings},
    ]},
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      {/* ── SIDEBAR ── */}
      <aside className="w-56 bg-brand-navy flex flex-col fixed top-0 left-0 h-screen z-40">
        <div className="px-4 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <img src={`${API}/uploads/logo.png`} alt="Kifaru" className="h-9 w-auto object-contain" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
            <div><p className="font-heading font-bold text-white text-sm">KIFARU</p><p className="text-[10px] text-blue-300 tracking-widest">Admin Panel</p></div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 min-h-0">
          {navGroups.map(group=>(
            <div key={group.label} className="mb-1">
              <p className="px-4 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-blue-400/60">{group.label}</p>
              {group.items.map(item=>(
                <button key={item.id} onClick={()=>setPanel(item.id as Panel)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-all ${panel===item.id?'bg-brand-red text-white':'text-blue-200 hover:text-white hover:bg-white/10'}`}>
                  <item.icon size={14}/>
                  <span className="flex-1 text-left">{item.label}</span>
                  {typeof (item as any).count==='number'&&(item as any).count>0&&(
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${panel===item.id?'bg-white/20 text-white':'bg-white/10 text-blue-300'}`}>{(item as any).count}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-white/10 space-y-1 flex-shrink-0">
          <a href="/" className="w-full flex items-center gap-2 text-blue-300 hover:text-white text-xs py-1.5 transition-colors"><ArrowLeft size={12}/>Back to Website</a>
          <button onClick={loadAll} className="w-full flex items-center gap-2 text-blue-300 hover:text-white text-xs py-1.5 transition-colors"><RefreshCw size={12}/>{loading?'Refreshing...':'Refresh'}</button>
          <button onClick={()=>{localStorage.removeItem('kifaru_token');setAuthed(false)}} className="w-full flex items-center gap-2 text-blue-300 hover:text-red-400 text-xs py-1.5 transition-colors"><LogOut size={12}/>Logout</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="ml-56 flex-1 min-h-screen">
        <div className="p-8">
          {panel==='overview'     && <OverviewPanel bookings={bookings} projects={projects} gallery={gallery} customers={customers} setPanel={setPanel}/>}
          {panel==='bookings'     && <BookingsPanel data={bookings} setData={setBookings} showToast={showToast}/>}
          {panel==='customers'    && <CustomersPanel bookings={bookings} showToast={showToast}/>}
          {panel==='properties'   && <PropertiesPanel data={properties} setData={setProperties} showToast={showToast}/>}
          {panel==='services'     && <SimplePanel title="Service" data={services} setData={setServices} showToast={showToast} createFn={createService} updateFn={updateService} deleteFn={deleteService} withImages="multi"
            fields={[{k:'name',l:'Service Name',req:true},{k:'category',l:'Category',sel:['Residential Construction','Commercial Buildings','Paving & Kerbstones','Landscaping','Electrical Works','Joinery & Carpentry','Real Estate','Other'],def:'Paving & Kerbstones'},{k:'tag',l:'Short Tag',ph:'e.g. Supply · Installation'},{k:'description',l:'Description',ta:true,full:true,req:true}]}/>}
          {panel==='projects'     && <SimplePanel title="Project" data={projects} setData={setProjects} showToast={showToast} createFn={createProject} updateFn={updateProject} deleteFn={deleteProject} withImages="single"
            fields={[{k:'name',l:'Project Name',req:true},{k:'location',l:'Location',req:true},{k:'year',l:'Year',ph:'2024'},{k:'status',l:'Status',sel:['Completed','Ongoing'],def:'Completed'},{k:'description',l:'Description',ta:true,full:true}]}/>}
          {panel==='testimonials' && <SimplePanel title="Testimonial" data={testimonials} setData={setTestimonials} showToast={showToast} createFn={createTestimonial} updateFn={updateTestimonial} deleteFn={deleteTestimonial}
            fields={[{k:'name',l:'Client Name',req:true},{k:'role',l:'Role / Location',ph:'Homeowner, Dar es Salaam'},{k:'rating',l:'Rating (1-5)',type:'number',def:'5'},{k:'text',l:'Testimonial',ta:true,full:true,req:true}]}/>}
          {panel==='floorplans'   && <SimplePanel title="Floor Plan" data={floorplans} setData={setFloorplans} showToast={showToast} createFn={createFloorPlan} updateFn={updateFloorPlan} deleteFn={deleteFloorPlan} withImages="multi"
            fields={[{k:'name',l:'Plan Name',req:true},{k:'type',l:'Type',ph:'Residential · Bungalow'},{k:'bedrooms',l:'Bedrooms',type:'number'},{k:'bathrooms',l:'Bathrooms',type:'number'},{k:'area',l:'Area (m²)',type:'number'},{k:'price',l:'Price',ph:'85M'},{k:'note',l:'Payment Note',full:true,ph:'Pay after handover'}]}/>}
          {panel==='agents'       && <SimplePanel title="Agent" data={agents} setData={setAgents} showToast={showToast} createFn={createAgent} updateFn={updateAgent} deleteFn={deleteAgent} withImages="photo"
            fields={[{k:'name',l:'Full Name',req:true},{k:'title',l:'Job Title',ph:'Senior Property Agent'},{k:'phone',l:'Phone'},{k:'email',l:'Email'},{k:'speciality',l:'Speciality'},{k:'experience',l:'Experience',ph:'5 years'}]}/>}
          {panel==='equipment'    && <SimplePanel title="Equipment" data={equipment} setData={setEquipment} showToast={showToast} createFn={createEquipment} updateFn={updateEquipment} deleteFn={deleteEquipment}
            fields={[{k:'name',l:'Equipment Name',req:true,full:true},{k:'quantity',l:'Quantity',type:'number',def:'1'},{k:'category',l:'Category',sel:['Vehicles','Machinery','Tools','Other'],def:'Machinery'},{k:'condition',l:'Condition',sel:['Very Good (Brand New)','Very Good','Good Working','Good','Working','Fair'],def:'Good'},{k:'notes',l:'Notes',ta:true,full:true}]}/>}
          {panel==='gallery'      && <GalleryPanel data={gallery} setData={setGallery} showToast={showToast}/>}
          {panel==='team'         && <SimplePanel title="Team Member" data={team} setData={setTeam} showToast={showToast} createFn={createTeam} updateFn={updateTeam} deleteFn={deleteTeam} withImages="photo"
            fields={[{k:'name',l:'Full Name',req:true},{k:'title',l:'Job Title',req:true},{k:'department',l:'Department',ph:'Technical / Management'},{k:'order',l:'Display Order',type:'number',def:'0'},{k:'description',l:'Bio',ta:true,full:true}]}/>}
          {panel==='certificates' && <CertificatesPanel data={certificates} setData={setCertificates} showToast={showToast}/>}
          {panel==='homepage'     && <HomepagePanel homepage={homepage} setHomepage={setHomepage} showToast={showToast} offers={offers} setOffers={setOffers} clientLogos={clientLogos} setClientLogos={setClientLogos}/>}
        </div>
      </main>
    </div>
  )
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
function OverviewPanel({ bookings, projects, gallery, customers, setPanel }: any) {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-brand-navy mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {l:'New Bookings',v:bookings.filter((b:any)=>b.status==='new').length,cl:'border-brand-red',icon:ClipboardList,p:'bookings'},
          {l:'Customers',v:customers.length,cl:'border-brand-navy',icon:Users,p:'customers'},
          {l:'Projects',v:projects.length,cl:'border-blue-500',icon:Package,p:'projects'},
          {l:'Gallery Photos',v:gallery.length,cl:'border-green-500',icon:Camera,p:'gallery'},
        ].map(s=>(
          <button key={s.l} onClick={()=>setPanel(s.p)} className={`bg-white border border-gray-200 hover:border-gray-300 rounded-sm p-5 text-left border-l-4 ${s.cl} transition-all hover:-translate-y-0.5 shadow-sm`}>
            <s.icon size={18} className="text-gray-400 mb-3"/>
            <p className="font-heading text-3xl font-bold text-brand-navy">{s.v}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1">{s.l}</p>
          </button>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-brand-navy">Recent Bookings</h2>
          <button onClick={()=>setPanel('bookings')} className="text-xs text-brand-red hover:underline flex items-center gap-1">View all<ChevronRight size={12}/></button>
        </div>
        <Tbl headers={['Name','Phone','Service','Date','Status']} rows={bookings.slice(0,8).map((b:any)=>[
          <span className="font-medium text-brand-navy">{b.name}</span>,b.phone,b.service,
          <span className="text-gray-400 text-xs">{new Date(b.createdAt).toLocaleDateString()}</span>,<Badge status={b.status}/>,
        ])}/>
      </div>
    </div>
  )
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
function BookingsPanel({ data, setData, showToast }: any) {
  const [selected,setSelected] = useState<any>(null)
  const handle = async (id: string, action: string) => {
    try {
      if (action==='delete') {
        if (!confirm('Delete this booking?')) return
        await deleteBooking(id); setData((d:any[])=>d.filter(x=>x._id!==id)); if(selected?._id===id) setSelected(null); showToast('Deleted')
      } else {
        await updateBookingStatus(id,action); setData((d:any[])=>d.map(x=>x._id===id?{...x,status:action}:x))
        if(selected?._id===id) setSelected((s:any)=>({...s,status:action})); showToast('Status updated')
      }
    } catch { showToast('Failed','error') }
  }
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-brand-navy mb-6">Bookings ({data.length})</h1>
      <div className="flex gap-5">
        <div className="flex-1 min-w-0">
          <Tbl headers={['Name','Phone','Service','Date','Status','Actions']} rows={data.map((b:any)=>[
            <button onClick={()=>setSelected(selected?._id===b._id?null:b)} className="font-medium text-brand-navy hover:text-brand-red transition-colors">{b.name}</button>,
            b.phone, b.service,
            <span className="text-gray-400 text-xs">{new Date(b.createdAt).toLocaleDateString()}</span>,
            <Badge status={b.status}/>,
            <div className="flex gap-1.5">
              <button onClick={()=>handle(b._id,'contacted')} className="text-xs border border-green-200 text-green-700 hover:bg-green-50 px-2.5 py-1.5 rounded-sm transition-colors">Contacted</button>
              <ABtn onClick={()=>handle(b._id,'delete')} icon={Trash2} danger/>
            </div>,
          ])}/>
        </div>
        {selected&&(
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm sticky top-8">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-heading font-semibold text-brand-navy">Booking Detail</h3>
                <button onClick={()=>setSelected(null)}><X size={16} className="text-gray-400"/></button>
              </div>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><Badge status={selected.status}/><span className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleDateString()}</span></div>
              <div className="px-5 py-4 border-b border-gray-100 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center"><span className="text-white text-sm font-bold">{selected.name?.[0]?.toUpperCase()}</span></div>
                  <div><p className="font-semibold text-brand-navy text-sm">{selected.name}</p><p className="text-xs text-gray-400">{selected.email||'—'}</p></div>
                </div>
                <div className="flex items-center gap-2 text-sm"><Phone size={13} className="text-gray-400"/><a href={`tel:${selected.phone}`} className="text-brand-navy hover:text-brand-red font-medium">{selected.phone}</a></div>
                {selected.location&&<div className="flex items-center gap-2 text-sm"><MapPin size={13} className="text-gray-400"/><span className="text-gray-600">{selected.location}</span></div>}
              </div>
              <div className="px-5 py-4 border-b border-gray-100"><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Service</p><p className="text-sm font-semibold text-brand-navy">{selected.service}</p></div>
              {selected.message&&<div className="px-5 py-4 border-b border-gray-100"><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Message</p><p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selected.message}</p></div>}
              <div className="px-5 py-4 flex flex-col gap-2">
                <div className="flex gap-2">
                  <button onClick={()=>handle(selected._id,'contacted')} className="flex-1 text-xs border border-green-200 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 py-2 rounded-sm font-semibold transition-all">Mark Contacted</button>
                  <button onClick={()=>handle(selected._id,'closed')} className="flex-1 text-xs border border-gray-200 text-gray-500 hover:bg-gray-100 py-2 rounded-sm font-semibold transition-all">Close</button>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${selected.phone}`} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white py-2 rounded-sm transition-all"><Phone size={11}/>Call</a>
                  <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center text-xs font-bold border border-green-200 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 py-2 rounded-sm transition-all">WhatsApp</a>
                  <button onClick={()=>handle(selected._id,'delete')} className="p-2 border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all"><Trash2 size={12}/></button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────
function CustomersPanel({ bookings, showToast }: any) {
  const [search,setSearch]             = useState('')
  const [selected,setSelected]         = useState<any>(null)
  const [statusFilter,setStatusFilter] = useState('all')
  const customers = deriveCustomers(bookings)
  const filtered = customers.filter(c=>{
    const q=search.toLowerCase()
    return (!q||c.name.toLowerCase().includes(q)||c.phone.includes(q)||c.email.toLowerCase().includes(q))
      &&(statusFilter==='all'||c.bookings.some((b:any)=>b.status===statusFilter))
  })
  const exportCSV = () => {
    const headers = ['Name','Phone','Email','Location','Total Bookings','Last Contact']
    const rows = filtered.map(c=>[c.name,c.phone,c.email,c.location,c.bookings.length,new Date(c.lastContact).toLocaleDateString()])
    const csv = [headers,...rows].map(r=>r.map(v=>`"${v}"`).join(',')).join('\n')
    const a = document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='customers.csv'; a.click()
    showToast('Exported')
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading text-2xl font-bold text-brand-navy">Customers</h1><p className="text-gray-400 text-sm mt-0.5">{customers.length} unique from {bookings.length} bookings</p></div>
        <button onClick={exportCSV} className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-brand-navy hover:text-brand-navy text-xs font-bold uppercase px-4 py-2.5 rounded-sm transition-colors"><Download size={14}/>Export CSV</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{l:'Total',v:customers.length,cl:'border-brand-navy'},{l:'New Enquiries',v:customers.filter(c=>c.bookings.some((b:any)=>b.status==='new')).length,cl:'border-blue-500'},{l:'Contacted',v:customers.filter(c=>c.bookings.some((b:any)=>b.status==='contacted')).length,cl:'border-green-500'},{l:'Repeat',v:customers.filter(c=>c.bookings.length>1).length,cl:'border-yellow-500'}].map(s=>(
          <div key={s.l} className={`bg-white border border-gray-200 border-l-4 ${s.cl} rounded-sm p-4 shadow-sm`}><p className="font-heading text-2xl font-bold text-brand-navy">{s.v}</p><p className="text-xs font-bold uppercase text-gray-500 mt-0.5">{s.l}</p></div>
        ))}
      </div>
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input className={`${inp} pl-9`} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <select className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-sm text-gray-700 focus:outline-none" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="all">All</option><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
        </select>
      </div>
      <div className="flex gap-5">
        <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
          {filtered.length===0?<div className="text-center text-gray-400 py-16">No customers found</div>:filtered.map(c=>(
            <button key={c.id} onClick={()=>setSelected(selected?.id===c.id?null:c)}
              className={`w-full flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0 text-left hover:bg-gray-50 transition-all ${selected?.id===c.id?'bg-blue-50 border-l-4 border-l-brand-navy':''}`}>
              <div className="w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center flex-shrink-0"><span className="text-white text-xs font-bold">{c.name?.[0]?.toUpperCase()}</span></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="font-semibold text-brand-navy text-sm truncate">{c.name}</p>{c.bookings.length>1&&<span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">{c.bookings.length}x</span>}</div>
                <span className="flex items-center gap-1 text-xs text-gray-400"><Phone size={10}/>{c.phone}</span>
              </div>
              <div className="text-right flex-shrink-0"><Badge status={c.bookings[c.bookings.length-1]?.status}/><p className="text-[10px] text-gray-400 mt-1">{new Date(c.lastContact).toLocaleDateString()}</p></div>
            </button>
          ))}
        </div>
        {selected&&(
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm sticky top-8">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"><h3 className="font-heading font-semibold text-brand-navy">Customer Detail</h3><button onClick={()=>setSelected(null)}><X size={16} className="text-gray-400"/></button></div>
              <div className="px-5 py-4 text-center border-b border-gray-100">
                <div className="w-14 h-14 rounded-full bg-brand-navy flex items-center justify-center mx-auto mb-2"><span className="text-white text-xl font-bold">{selected.name?.[0]?.toUpperCase()}</span></div>
                <h4 className="font-heading font-bold text-brand-navy">{selected.name}</h4>
                {selected.bookings.length>1&&<span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full mt-1 inline-block">Repeat · {selected.bookings.length} bookings</span>}
              </div>
              <div className="px-5 py-4 space-y-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm"><Phone size={13} className="text-gray-400"/><a href={`tel:${selected.phone}`} className="text-brand-navy font-medium">{selected.phone}</a></div>
                {selected.email!=='—'&&<div className="flex items-center gap-2 text-sm"><Mail size={13} className="text-gray-400"/><a href={`mailto:${selected.email}`} className="text-brand-navy font-medium truncate">{selected.email}</a></div>}
                {selected.location!=='—'&&<div className="flex items-center gap-2 text-sm"><MapPin size={13} className="text-gray-400"/><span className="text-gray-600">{selected.location}</span></div>}
              </div>
              <div className="px-5 py-4 space-y-2 max-h-60 overflow-y-auto">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Bookings ({selected.bookings.length})</p>
                {selected.bookings.map((b:any,i:number)=>(
                  <div key={b._id||i} className="bg-gray-50 rounded-sm p-3 border border-gray-100">
                    <div className="flex items-center justify-between mb-1"><span className="text-xs font-semibold text-brand-navy">{b.service}</span><Badge status={b.status}/></div>
                    {b.message&&<p className="text-xs text-gray-500 line-clamp-2">{b.message}</p>}
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
                <a href={`tel:${selected.phone}`} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white py-2.5 rounded-sm transition-all"><Phone size={12}/>Call</a>
                <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center text-xs font-bold border border-green-200 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 py-2.5 rounded-sm transition-all">WA</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PROPERTIES ───────────────────────────────────────────────────────────────
function PropertiesPanel({ data, setData, showToast }: any) {
  const empty = {title:'',price:'',type:'house',status:'sale',location:'',bedrooms:'',bathrooms:'',area:'',description:'',featured:false}
  const [showForm,setShowForm] = useState(false)
  const [editing,setEditing]   = useState<any>(null)
  const [saving,setSaving]     = useState(false)
  const [form,setForm]         = useState<any>(empty)
  const [files,setFiles]       = useState<File[]>([])
  const open=(p?:any)=>{setEditing(p||null);setForm(p?{title:p.title,price:p.price,type:p.type,status:p.status,location:p.location,bedrooms:p.bedrooms||'',bathrooms:p.bathrooms||'',area:p.area||'',description:p.description||'',featured:!!p.featured}:empty);setFiles([]);setShowForm(true)}
  const save=async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);try{const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,String(v)));files.forEach(f=>fd.append('images',f));if(editing){const u=await updateProperty(editing._id,fd);setData((d:any[])=>d.map(x=>x._id===editing._id?u:x));showToast('Updated')}else{const c=await createProperty(fd);setData((d:any[])=>[c,...d]);showToast('Created')};setShowForm(false)}catch{showToast('Failed','error')}finally{setSaving(false)}}
  const del=async(id:string)=>{if(!confirm('Delete?'))return;try{await deleteProperty(id);setData((d:any[])=>d.filter(x=>x._id!==id));showToast('Deleted')}catch{showToast('Failed','error')}}
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-navy">Properties ({data.length})</h1>
        <button onClick={()=>open()} className={btn}><Plus size={14}/>Add Property</button>
      </div>
      {showForm&&(
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5"><h2 className="font-heading font-semibold text-brand-navy text-lg">{editing?'Edit':'New'} Property</h2><button onClick={()=>setShowForm(false)}><X size={18} className="text-gray-400"/></button></div>
          <form onSubmit={save}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2"><Fld label="Title *"><input className={inp} required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></Fld></div>
              <Fld label="Price (TZS) *"><input className={inp} type="number" required value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></Fld>
              <Fld label="Type"><select className={sel} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{['house','apartment','land','commercial'].map(t=><option key={t}>{t}</option>)}</select></Fld>
              <Fld label="Status"><select className={sel} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="sale">For Sale</option><option value="rent">For Rent</option></select></Fld>
              <Fld label="Location *"><input className={inp} required value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></Fld>
              <Fld label="Bedrooms"><input className={inp} type="number" value={form.bedrooms} onChange={e=>setForm({...form,bedrooms:e.target.value})}/></Fld>
              <Fld label="Bathrooms"><input className={inp} type="number" value={form.bathrooms} onChange={e=>setForm({...form,bathrooms:e.target.value})}/></Fld>
              <Fld label="Area (m²)"><input className={inp} type="number" value={form.area} onChange={e=>setForm({...form,area:e.target.value})}/></Fld>
              <div className="col-span-2"><Fld label="Description"><textarea className={ta} rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></Fld></div>
              <div className="col-span-2"><ImgUpload label="Images" multiple files={files} onFiles={setFiles}/></div>
              <div className="col-span-2 flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} className="w-4 h-4 accent-brand-red"/><span className="text-sm text-gray-600 font-medium">Featured Property</span></div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button type="submit" disabled={saving} className={`${btn} disabled:opacity-50`}>{saving?<><Loader size={13} className="animate-spin"/>Saving...</>:'Save Property'}</button>
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2.5 border border-gray-200 text-gray-500 text-xs rounded-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <Tbl headers={['Image','Title','Price','Type','Status','Location','Actions']} rows={data.map((p:any)=>{
        const img=p.images?.[0]?`${API}/uploads/${p.images[0]}`:null
        return[img?<img src={img} className="w-12 h-10 object-cover rounded-sm border border-gray-200" alt=""/>:<div className="w-12 h-10 bg-gray-100 rounded-sm flex items-center justify-center"><ImageIcon size={14} className="text-gray-300"/></div>,
          <span className="font-medium text-brand-navy max-w-[160px] truncate block">{p.title}</span>,`TZS ${Number(p.price).toLocaleString()}`,<span className="capitalize">{p.type}</span>,<Badge status={p.status}/>,p.location,
          <div className="flex gap-1.5"><ABtn onClick={()=>open(p)} icon={Edit2}/><ABtn onClick={()=>del(p._id)} icon={Trash2} danger/></div>]
      })}/>
    </div>
  )
}

// ─── SIMPLE PANEL ─────────────────────────────────────────────────────────────
function SimplePanel({ title, data, setData, showToast, fields, createFn, updateFn, deleteFn, withImages }: any) {
  const empty = fields.reduce((a:any,f:any)=>({...a,[f.k]:f.def??''}),{})
  const [showForm,setShowForm] = useState(false)
  const [editing,setEditing]   = useState<any>(null)
  const [saving,setSaving]     = useState(false)
  const [form,setForm]         = useState<any>({})
  const [file,setFile]         = useState<File|null>(null)
  const [files,setFiles]       = useState<File[]>([])
  const open=(item?:any)=>{setEditing(item||null);setForm(item?fields.reduce((a:any,f:any)=>({...a,[f.k]:item[f.k]??f.def??''}),{}):empty);setFile(null);setFiles([]);setShowForm(true)}
  const save=async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);try{let pl:any=form;if(withImages==='single'){const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,String(v)));if(file)fd.append('image',file);pl=fd}else if(withImages==='multi'){const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,String(v)));files.forEach(f2=>fd.append('images',f2));pl=fd}else if(withImages==='photo'){const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,String(v)));if(file)fd.append('photo',file);pl=fd};if(editing){const u=await updateFn(editing._id,pl);setData((d:any[])=>d.map(x=>x._id===editing._id?u:x));showToast(`${title} updated`)}else{const c=await createFn(pl);setData((d:any[])=>[c,...d]);showToast(`${title} created`)};setShowForm(false)}catch{showToast('Failed','error')}finally{setSaving(false)}}
  const del=async(id:string)=>{if(!confirm('Delete?'))return;try{await deleteFn(id);setData((d:any[])=>d.filter(x=>x._id!==id));showToast('Deleted')}catch{showToast('Failed','error')}}
  const vf=fields.filter((f:any)=>!f.hide)
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-navy">{title}s ({data.length})</h1>
        <button onClick={()=>open()} className={btn}><Plus size={14}/>Add {title}</button>
      </div>
      {showForm&&(
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5"><h2 className="font-heading font-semibold text-brand-navy text-lg">{editing?'Edit':'New'} {title}</h2><button onClick={()=>setShowForm(false)}><X size={18} className="text-gray-400"/></button></div>
          <form onSubmit={save}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {fields.map((f:any)=>(
                <div key={f.k} className={f.full?'col-span-2':''}>
                  <Fld label={`${f.l}${f.req?' *':''}`}>
                    {f.ta?<textarea className={ta} rows={3} required={f.req} placeholder={f.ph} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                     :f.sel?<select className={sel} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}>{f.sel.map((o:string)=><option key={o}>{o}</option>)}</select>
                     :<input className={inp} type={f.type||'text'} required={f.req} placeholder={f.ph} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>}
                  </Fld>
                </div>
              ))}
              {withImages&&<div className="col-span-2"><ImgUpload label={withImages==='multi'?'Images':'Photo'} multiple={withImages==='multi'} file={file} files={files} onFile={setFile} onFiles={setFiles}/></div>}
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button type="submit" disabled={saving} className={`${btn} disabled:opacity-50`}>{saving?<><Loader size={13} className="animate-spin"/>Saving...</>:`Save ${title}`}</button>
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2.5 border border-gray-200 text-gray-500 text-xs rounded-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <Tbl headers={[...vf.map((f:any)=>f.l),'Actions']} rows={data.map((item:any)=>[
        ...vf.map((f:any)=>{const v=item[f.k];if(f.ta||f.full)return<span className="text-gray-500 max-w-[180px] truncate block">{String(v||'—')}</span>;return<span>{String(v??'—')}</span>}),
        <div className="flex gap-1.5"><ABtn onClick={()=>open(item)} icon={Edit2}/><ABtn onClick={()=>del(item._id)} icon={Trash2} danger/></div>,
      ])}/>
    </div>
  )
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────
function GalleryPanel({ data, setData, showToast }: any) {
  const [saving,setSaving] = useState(false)
  const [form,setForm]     = useState({title:'',category:'Projects'})
  const [file,setFile]     = useState<File|null>(null)
  const save=async(e:React.FormEvent)=>{e.preventDefault();if(!file){showToast('Select image','error');return};setSaving(true);try{const fd=new FormData();fd.append('title',form.title);fd.append('category',form.category);fd.append('image',file);const c=await createGallery(fd);setData((d:any[])=>[c,...d]);showToast('Photo added');setForm({title:'',category:'Projects'});setFile(null)}catch{showToast('Failed','error')}finally{setSaving(false)}}
  const del=async(id:string)=>{if(!confirm('Delete?'))return;try{await deleteGallery(id);setData((d:any[])=>d.filter(x=>x._id!==id));showToast('Deleted')}catch{showToast('Failed','error')}}
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-brand-navy mb-6">Gallery ({data.length} photos)</h1>
      <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6 shadow-sm">
        <h2 className="font-heading font-semibold text-brand-navy mb-4">Upload Photo</h2>
        <form onSubmit={save} className="grid grid-cols-3 gap-4 items-end">
          <Fld label="Title"><input className={inp} placeholder="Caption..." value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></Fld>
          <Fld label="Category"><select className={sel} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{['Projects','Paving','Team','Activities','Equipment','General'].map(c=><option key={c}>{c}</option>)}</select></Fld>
          <Fld label="Image *"><div className="relative border-2 border-dashed border-gray-200 hover:border-brand-navy rounded-sm p-3 text-center cursor-pointer transition-colors"><p className="text-xs text-gray-400">{file?file.name:'Click to select'}</p><input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>setFile(e.target.files?.[0]||null)}/></div></Fld>
          <div className="col-span-3"><button type="submit" disabled={saving||!file} className={`${btn} disabled:opacity-50`}>{saving?<><Loader size={13} className="animate-spin"/>Uploading...</>:<><Plus size={14}/>Add Photo</>}</button></div>
        </form>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {data.map((item:any)=>{const img=item.image?.startsWith('http')?item.image:`${API}/uploads/${item.image}`;return(
          <div key={item._id}><div className="h-28 rounded-sm overflow-hidden border border-gray-100"><img src={img} alt={item.title} className="w-full h-full object-cover"/></div>
          <div className="mt-1 flex items-center justify-between"><p className="text-xs text-gray-600 truncate">{item.title||'—'}</p><button onClick={()=>del(item._id)} className="p-1 hover:text-brand-red text-gray-300"><Trash2 size={12}/></button></div></div>
        )})}
      </div>
    </div>
  )
}

// ─── CERTIFICATES ─────────────────────────────────────────────────────────────
function CertificatesPanel({ data, setData, showToast }: any) {
  const [saving,setSaving]     = useState(false)
  const [editing,setEditing]   = useState<any>(null)
  const [showForm,setShowForm] = useState(false)
  const [form,setForm]         = useState({label:'',detail:'',sub:'',order:'0'})
  const [file,setFile]         = useState<File|null>(null)
  const defaults=[{label:'CRB CNL Works',detail:'C4/731/02/2026',sub:'Class 4 Civil & Nominated Works',order:0},{label:'CRB Building Works',detail:'B4/895/02/2026',sub:'Class 4 Building Works',order:1},{label:'Company Registration',detail:'No. 58147',sub:'Registered Nov 2023',order:2},{label:'TIN Registration',detail:'106-957-053',sub:'Tanzania Revenue Authority',order:3},{label:'VAT Registration',detail:'40-045251-B',sub:'VAT Registered Feb 2022',order:4}]
  const open=(c?:any)=>{setEditing(c||null);setForm(c?{label:c.label,detail:c.detail||'',sub:c.sub||'',order:String(c.order||0)}:{label:'',detail:'',sub:'',order:'0'});setFile(null);setShowForm(true)}
  const save=async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);try{const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,String(v)));if(file)fd.append('image',file);if(editing){const u=await updateCertificate(editing._id,fd);setData((d:any[])=>d.map(x=>x._id===editing._id?u:x));showToast('Updated')}else{const c=await createCertificate(fd);setData((d:any[])=>[...d,c]);showToast('Added')};setShowForm(false)}catch{showToast('Failed','error')}finally{setSaving(false)}}
  const del=async(id:string)=>{if(!confirm('Delete?'))return;try{await deleteCertificate(id);setData((d:any[])=>d.filter(x=>x._id!==id));showToast('Deleted')}catch{showToast('Failed','error')}}
  const seed=async()=>{setSaving(true);try{for(const c of defaults){const fd=new FormData();Object.entries(c).forEach(([k,v])=>fd.append(k,String(v)));const r=await createCertificate(fd);setData((d:any[])=>[...d,r])};showToast('Defaults added')}catch{showToast('Failed','error')}finally{setSaving(false)}}
  return(
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-navy">Certificates ({data.length})</h1>
        <div className="flex gap-2">{data.length===0&&<button onClick={seed} disabled={saving} className="border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white text-xs font-semibold px-4 py-2.5 rounded-sm disabled:opacity-50">Seed Defaults</button>}<button onClick={()=>open()} className={btn}><Plus size={14}/>Add</button></div>
      </div>
      {showForm&&(
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5"><h2 className="font-heading font-semibold text-brand-navy">{editing?'Edit':'Add'} Certificate</h2><button onClick={()=>setShowForm(false)}><X size={18} className="text-gray-400"/></button></div>
          <form onSubmit={save}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Fld label="Label *"><input className={inp} required value={form.label} onChange={e=>setForm({...form,label:e.target.value})}/></Fld>
              <Fld label="Reference No."><input className={inp} value={form.detail} onChange={e=>setForm({...form,detail:e.target.value})}/></Fld>
              <Fld label="Subtitle"><input className={inp} value={form.sub} onChange={e=>setForm({...form,sub:e.target.value})}/></Fld>
              <Fld label="Order"><input className={inp} type="number" value={form.order} onChange={e=>setForm({...form,order:e.target.value})}/></Fld>
              <div className="col-span-2"><ImgUpload label="Certificate Image" file={file} onFile={setFile} current={editing?.image?`${API}/uploads/${editing.image}`:undefined}/></div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button type="submit" disabled={saving} className={`${btn} disabled:opacity-50`}>{saving?<><Loader size={13} className="animate-spin"/>Saving...</>:'Save'}</button>
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2.5 border border-gray-200 text-gray-500 text-xs rounded-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
      {data.length===0?(<div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-sm"><Award size={40} className="text-gray-200 mx-auto mb-3"/><p className="text-gray-400 mb-4">No certificates yet</p><button onClick={seed} disabled={saving} className={btn}>Seed Defaults</button></div>):(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.map((cert:any)=>{const imgUrl=cert.image?`${API}/uploads/${cert.image}`:null;return(
            <div key={cert._id} className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
              <div className="h-40 bg-gray-50 border-b border-gray-100 flex items-center justify-center relative">
                {imgUrl?<img src={imgUrl} alt={cert.label} className="w-full h-full object-contain p-2"/>:<div className="text-center"><ImageIcon size={28} className="text-gray-200 mx-auto"/><p className="text-xs text-gray-300">No image</p></div>}
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${imgUrl?'bg-green-100 text-green-700':'bg-orange-100 text-orange-600'}`}>{imgUrl?'✓ Uploaded':'No image'}</span>
              </div>
              <div className="p-4">
                <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-0.5">{cert.label}</p>
                <p className="text-sm font-semibold text-brand-navy">{cert.detail||'—'}</p>
                <p className="text-xs text-gray-400 mb-3">{cert.sub||'—'}</p>
                <div className="flex gap-2"><button onClick={()=>open(cert)} className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white px-3 py-2 rounded-sm transition-all"><Edit2 size={11}/>{imgUrl?'Replace':'Upload'} Image</button><ABtn onClick={()=>del(cert._id)} icon={Trash2} danger/></div>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  )
}

// ─── HOMEPAGE PANEL — tabs: Settings | Offers & News | Client Logos ───────────
function HomepagePanel({ homepage, setHomepage, showToast, offers, setOffers, clientLogos, setClientLogos }: any) {
  const [tab,setTab] = useState<'settings'|'offers'|'logos'>('settings')
  const tabs = [
    {id:'settings',label:'⚙ Settings'},
    {id:'offers',  label:`📣 Offers & News (${offers.length})`},
    {id:'logos',   label:`🏢 Client Logos (${clientLogos.length})`},
  ]
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-brand-navy mb-1">Homepage & Content</h1>
      <p className="text-gray-400 text-sm mb-5">Manage hero text, offers/announcements and client logos all in one place</p>
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-sm w-fit">
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-sm transition-all ${tab===t.id?'bg-white text-brand-navy shadow-sm':'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab==='settings' && <HomepageSettingsTab homepage={homepage} setHomepage={setHomepage} showToast={showToast}/>}
      {tab==='offers'   && <OffersTab data={offers} setData={setOffers} showToast={showToast}/>}
      {tab==='logos'    && <ClientLogosTab data={clientLogos} setData={setClientLogos} showToast={showToast}/>}
    </div>
  )
}

function HomepageSettingsTab({ homepage, setHomepage, showToast }: any) {
  const [form,setForm]                   = useState(homepage)
  const [saving,setSaving]               = useState(false)
  const [logoUploading,setLogoUploading] = useState(false)
  const [logoPreview,setLogoPreview]     = useState<string|null>(null)
  useEffect(()=>{setForm(homepage)},[homepage])
  const save=async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);try{const u=await updateHomepageSettings(form);setHomepage(u);showToast('Saved!')}catch{showToast('Failed','error')}finally{setSaving(false)}}
  const uploadLogo=async(file:File)=>{
    const reader=new FileReader();reader.onload=ev=>setLogoPreview(ev.target?.result as string);reader.readAsDataURL(file);setLogoUploading(true)
    try{const fd=new FormData();fd.append('logo',file);const token=localStorage.getItem('kifaru_token');const r=await fetch(`${API}/api/settings/logo`,{method:'POST',headers:{Authorization:`Bearer ${token}`},body:fd});const data=await r.json();if(r.ok){const updated=await updateHomepageSettings({...form,logoFilename:data.filename});setHomepage(updated);setForm(updated);showToast('Logo uploaded!')}else{showToast(data.error||'Upload failed','error');setLogoPreview(null)}}
    catch{showToast('Upload failed','error');setLogoPreview(null)}finally{setLogoUploading(false)}
  }
  const F=({label,k,isTA=false}:any)=><div><label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>{isTA?<textarea className={`${ta} min-h-[70px]`} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}/>:<input className={inp} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}/>}</div>
  return(
    <form onSubmit={save} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-brand-navy mb-5 pb-2 border-b border-gray-100">Hero Section</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><F label="Hero Badge Text" k="heroBadge"/></div>
          <div className="col-span-2"><F label="Hero Title" k="heroTitle" isTA/></div>
          <div className="col-span-2"><F label="Hero Subtitle" k="heroSubtitle" isTA/></div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-brand-navy mb-5 pb-2 border-b border-gray-100">Statistics Bar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <F label="Years" k="statYears"/><F label="Projects" k="statProjects"/><F label="Cities" k="statCities"/><F label="Clients" k="statClients"/>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-brand-navy mb-3 pb-2 border-b border-gray-100">Company Logo</h3>
        <div className="flex items-start gap-6">
          <div className="w-36 h-16 border-2 border-gray-100 rounded-sm bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
            {logoPreview?<img src={logoPreview} alt="Preview" className="max-w-full max-h-full object-contain p-1"/>
              :homepage?.logoFilename?<img src={`${API}/uploads/${homepage.logoFilename}?t=${Date.now()}`} alt="Logo" className="max-w-full max-h-full object-contain p-1" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
              :<div className="text-center"><ImageIcon size={20} className="text-gray-300 mx-auto"/><p className="text-[10px] text-gray-400">No logo</p></div>}
          </div>
          <label className={`flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-sm p-6 cursor-pointer transition-colors ${logoUploading?'border-brand-gold bg-yellow-50 cursor-not-allowed':'border-gray-200 hover:border-brand-navy'}`}>
            {logoUploading?<><Loader size={20} className="text-brand-gold animate-spin"/><span className="text-sm text-gray-500">Uploading...</span></>:<><ImageIcon size={20} className="text-gray-400"/><span className="text-sm text-gray-500 font-medium">Click to upload logo</span><span className="text-xs text-gray-400">PNG, SVG or WebP</span></>}
            <input type="file" accept="image/*,.svg" className="hidden" disabled={logoUploading} onChange={e=>{const f=e.target.files?.[0];if(f)uploadLogo(f);e.target.value=''}}/>
          </label>
        </div>
      </div>
      <button type="submit" disabled={saving} className={`${btn} disabled:opacity-50 py-3 px-8`}>{saving?<><Loader size={14} className="animate-spin"/>Saving...</>:'Save Settings'}</button>
    </form>
  )
}

function OffersTab({ data, setData, showToast }: any) {
  const emptyForm = {type:'offer',title:'',body:'',badge:'',color:'red',link:'',linkLabel:''}
  const [showForm,setShowForm] = useState(false)
  const [editing,setEditing]   = useState<any>(null)
  const [saving,setSaving]     = useState(false)
  const [file,setFile]         = useState<File|null>(null)
  const [form,setForm]         = useState<any>(emptyForm)
  const colors:Record<string,string> = {red:'bg-brand-red',navy:'bg-brand-navy',gold:'bg-brand-gold',green:'bg-green-600'}
  const open=(item?:any)=>{setEditing(item||null);setForm(item?{type:item.type||'offer',title:item.title||'',body:item.body||'',badge:item.badge||'',color:item.color||'red',link:item.link||'',linkLabel:item.linkLabel||''}:emptyForm);setFile(null);setShowForm(true)}
  const save=async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);try{const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,String(v)));if(file)fd.append('image',file);if(editing){const u=await updateOffer(editing._id,fd);setData((d:any[])=>d.map(x=>x._id===editing._id?u:x));showToast('Updated')}else{const c=await createOffer(fd);setData((d:any[])=>[c,...d]);showToast('Created')};setShowForm(false)}catch{showToast('Failed','error')}finally{setSaving(false)}}
  const del=async(id:string)=>{if(!confirm('Delete?'))return;try{await deleteOffer(id);setData((d:any[])=>d.filter(x=>x._id!==id));showToast('Deleted')}catch{showToast('Failed','error')}}
  return(
    <div>
      <div className="flex items-center justify-between mb-4">
        <div><p className="font-heading font-semibold text-brand-navy">Offers & Announcements</p><p className="text-xs text-gray-400">Appear as cards on the homepage. Up to 3 shown at once.</p></div>
        <button onClick={()=>open()} className={btn}><Plus size={14}/>Add New</button>
      </div>
      {showForm&&(
        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5"><h2 className="font-heading font-semibold text-brand-navy">{editing?'Edit':'New'} Offer / Announcement</h2><button onClick={()=>setShowForm(false)}><X size={18} className="text-gray-400"/></button></div>
          <form onSubmit={save}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Fld label="Type"><select className={sel} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="offer">Offer / Promotion</option><option value="announcement">Announcement / News</option></select></Fld>
              <Fld label="Accent Color"><select className={sel} value={form.color} onChange={e=>setForm({...form,color:e.target.value})}><option value="red">Red</option><option value="navy">Navy</option><option value="gold">Gold</option><option value="green">Green</option></select></Fld>
              <div className="col-span-2"><Fld label="Title *"><input className={inp} required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></Fld></div>
              <div className="col-span-2"><Fld label="Body *"><textarea className={ta} rows={3} required value={form.body} onChange={e=>setForm({...form,body:e.target.value})}/></Fld></div>
              <Fld label="Badge Label"><input className={inp} placeholder="e.g. Limited Time" value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}/></Fld>
              <Fld label="Link URL"><input className={inp} placeholder="/contact" value={form.link} onChange={e=>setForm({...form,link:e.target.value})}/></Fld>
              <Fld label="Link Button Label"><input className={inp} placeholder="Book Now" value={form.linkLabel} onChange={e=>setForm({...form,linkLabel:e.target.value})}/></Fld>
              <div className="col-span-2"><ImgUpload label="Banner Image (optional)" file={file} onFile={setFile} current={editing?.image?(editing.image.startsWith('http')?editing.image:`${API}/uploads/${editing.image}`):undefined}/></div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button type="submit" disabled={saving} className={`${btn} disabled:opacity-50`}>{saving?<><Loader size={13} className="animate-spin"/>Saving...</>:'Save'}</button>
              <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2.5 border border-gray-200 text-gray-500 text-xs rounded-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
      {data.length===0?(
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-sm"><Bell size={40} className="text-gray-200 mx-auto mb-3"/><p className="text-gray-400 mb-4">No offers yet</p><button onClick={()=>open()} className={btn}><Plus size={14}/>Add First Offer</button></div>
      ):(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item:any)=>{
            const imgUrl=item.image?(item.image.startsWith('http')?item.image:`${API}/uploads/${item.image}`):null
            return(
              <div key={item._id} className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                {imgUrl?(<div className="relative h-32 overflow-hidden"><img src={imgUrl} alt={item.title} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>{item.badge&&<span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[item.color]||'bg-brand-red'} text-white`}>{item.badge}</span>}</div>)
                :(<div className={`h-1.5 ${colors[item.color]||'bg-brand-red'}`}/>)}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">{item.type==='announcement'?<Bell size={12} className="text-brand-navy"/>:<Tag size={12} className="text-brand-red"/>}<span className="text-[10px] font-bold uppercase text-gray-400">{item.type}</span></div>
                  <h3 className="font-heading font-bold text-brand-navy text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-3">{item.body}</p>
                  <div className="flex gap-2 pt-2 border-t border-gray-100"><ABtn onClick={()=>open(item)} icon={Edit2}/><ABtn onClick={()=>del(item._id)} icon={Trash2} danger/></div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ClientLogosTab({ data, setData, showToast }: any) {
  const [saving,setSaving]       = useState(false)
  const [form,setForm]           = useState({name:''})
  const [file,setFile]           = useState<File|null>(null)
  const [editingId,setEditingId] = useState<string|null>(null)
  const [editName,setEditName]   = useState('')
  const add=async(e:React.FormEvent)=>{e.preventDefault();if(!file){showToast('Select a logo','error');return};setSaving(true);try{const fd=new FormData();fd.append('name',form.name);fd.append('logo',file);const c=await createClientLogo(fd);setData((d:any[])=>[...d,c]);showToast('Logo added');setForm({name:''});setFile(null)}catch{showToast('Failed','error')}finally{setSaving(false)}}
  const del=async(id:string)=>{if(!confirm('Delete?'))return;try{await deleteClientLogo(id);setData((d:any[])=>d.filter(x=>x._id!==id));showToast('Deleted')}catch{showToast('Failed','error')}}
  const saveEdit=async(id:string)=>{try{const fd=new FormData();fd.append('name',editName);const u=await updateClientLogo(id,fd);setData((d:any[])=>d.map(x=>x._id===id?u:x));setEditingId(null);showToast('Updated')}catch{showToast('Failed','error')}}
  return(
    <div>
      <div className="mb-4"><p className="font-heading font-semibold text-brand-navy">Client Logos</p><p className="text-xs text-gray-400">Auto-scrolling strip on the homepage. PNG with transparent background works best.</p></div>
      <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6 shadow-sm">
        <h2 className="font-heading font-semibold text-brand-navy mb-4">Add Logo</h2>
        <form onSubmit={add} className="grid grid-cols-3 gap-4 items-end">
          <Fld label="Company Name"><input className={inp} placeholder="e.g. NHC Tanzania" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Fld>
          <Fld label="Logo Image *">
            <div className="relative border-2 border-dashed border-gray-200 hover:border-brand-navy rounded-sm p-3 text-center cursor-pointer transition-colors">
              {file?<div className="flex items-center justify-center gap-2"><img src={URL.createObjectURL(file)} alt="" className="h-8 object-contain"/><span className="text-xs text-brand-navy truncate max-w-[80px]">{file.name}</span></div>:<p className="text-xs text-gray-400">Click to select PNG/SVG</p>}
              <input type="file" accept="image/*,.svg" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>setFile(e.target.files?.[0]||null)}/>
            </div>
          </Fld>
          <button type="submit" disabled={saving||!file} className={`${btn} w-full justify-center disabled:opacity-50`}>{saving?<><Loader size={13} className="animate-spin"/>Uploading...</>:<><Plus size={14}/>Add Logo</>}</button>
        </form>
      </div>
      {data.length===0?(<div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-sm"><Globe size={40} className="text-gray-200 mx-auto mb-3"/><p className="text-gray-400">No logos yet. Upload your first one above.</p></div>):(
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.map((item:any)=>{const imgUrl=item.logo?.startsWith('http')?item.logo:`${API}/uploads/${item.logo}`;return(
            <div key={item._id} className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <div className="h-14 flex items-center justify-center mb-3 bg-gray-50 rounded-sm"><img src={imgUrl} alt={item.name} className="max-h-full max-w-full object-contain"/></div>
              {editingId===item._id?(
                <div className="flex gap-1"><input className="flex-1 text-xs border border-gray-200 rounded-sm px-2 py-1 focus:outline-none focus:border-brand-navy" value={editName} onChange={e=>setEditName(e.target.value)}/><button onClick={()=>saveEdit(item._id)} className="text-xs bg-brand-navy text-white px-2 py-1 rounded-sm">✓</button><button onClick={()=>setEditingId(null)} className="text-xs border border-gray-200 text-gray-400 px-2 py-1 rounded-sm">✕</button></div>
              ):(
                <div className="flex items-center justify-between gap-1"><p className="text-xs text-gray-600 font-medium truncate flex-1">{item.name||'—'}</p><button onClick={()=>{setEditingId(item._id);setEditName(item.name||'')}} className="p-1 text-gray-400 hover:text-brand-navy"><Edit2 size={11}/></button><button onClick={()=>del(item._id)} className="p-1 text-gray-400 hover:text-brand-red"><Trash2 size={11}/></button></div>
              )}
            </div>
          )})}
        </div>
      )}
    </div>
  )
}