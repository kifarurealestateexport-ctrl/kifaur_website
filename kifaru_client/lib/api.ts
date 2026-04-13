import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'
const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('kifaru_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const adminLogin = (data: any) => api.post('/auth/login', data).then(r => r.data)

export const getProperties  = (params?: Record<string,string>) => api.get('/properties', { params }).then(r => r.data)
export const getProperty    = (id: string)    => api.get(`/properties/${id}`).then(r => r.data)
export const createProperty = (data: FormData)=> api.post('/properties', data).then(r => r.data)
export const updateProperty = (id: string, data: FormData) => api.put(`/properties/${id}`, data).then(r => r.data)
export const deleteProperty = (id: string)    => api.delete(`/properties/${id}`).then(r => r.data)

export const submitBooking       = (data: any)  => api.post('/bookings', data).then(r => r.data)
export const getBookings         = ()           => api.get('/bookings').then(r => r.data)
export const updateBookingStatus = (id: string, status: string) => api.patch(`/bookings/${id}`, { status }).then(r => r.data)
export const deleteBooking       = (id: string) => api.delete(`/bookings/${id}`).then(r => r.data)

export const getServices   = () => api.get('/services').then(r => r.data)
export const createService = (data: any) => api.post('/services', data).then(r => r.data)
export const updateService = (id: string, data: any) => api.put(`/services/${id}`, data).then(r => r.data)
export const deleteService = (id: string) => api.delete(`/services/${id}`).then(r => r.data)

export const getProjects   = () => api.get('/projects').then(r => r.data)
export const createProject = (data: any) => api.post('/projects', data).then(r => r.data)
export const updateProject = (id: string, data: any) => api.put(`/projects/${id}`, data).then(r => r.data)
export const deleteProject = (id: string) => api.delete(`/projects/${id}`).then(r => r.data)

export const getTestimonials   = () => api.get('/testimonials').then(r => r.data)
export const createTestimonial = (data: any) => api.post('/testimonials', data).then(r => r.data)
export const updateTestimonial = (id: string, data: any) => api.put(`/testimonials/${id}`, data).then(r => r.data)
export const deleteTestimonial = (id: string) => api.delete(`/testimonials/${id}`).then(r => r.data)

export const getFloorPlans   = () => api.get('/floorplans').then(r => r.data)
export const createFloorPlan = (data: any) => api.post('/floorplans', data).then(r => r.data)
export const updateFloorPlan = (id: string, data: any) => api.put(`/floorplans/${id}`, data).then(r => r.data)
export const deleteFloorPlan = (id: string) => api.delete(`/floorplans/${id}`).then(r => r.data)

export const getAgents   = () => api.get('/agents').then(r => r.data)
export const createAgent = (data: FormData) => api.post('/agents', data).then(r => r.data)
export const updateAgent = (id: string, data: FormData) => api.put(`/agents/${id}`, data).then(r => r.data)
export const deleteAgent = (id: string) => api.delete(`/agents/${id}`).then(r => r.data)

export const getHomepageSettings    = () => api.get('/settings/homepage').then(r => r.data)
export const updateHomepageSettings = (data: any) => api.put('/settings/homepage', data).then(r => r.data)

export const getEquipment    = () => api.get('/equipment').then(r => r.data)
export const createEquipment = (data: any) => api.post('/equipment', data).then(r => r.data)
export const updateEquipment = (id: string, data: any) => api.put(`/equipment/${id}`, data).then(r => r.data)
export const deleteEquipment = (id: string) => api.delete(`/equipment/${id}`).then(r => r.data)

export const getGallery    = (category?: string) => api.get('/gallery', { params: category ? { category } : {} }).then(r => r.data)
export const createGallery = (data: FormData) => api.post('/gallery', data).then(r => r.data)
export const deleteGallery = (id: string) => api.delete(`/gallery/${id}`).then(r => r.data)

export const getTeam    = () => api.get('/team').then(r => r.data)
export const createTeam = (data: FormData) => api.post('/team', data).then(r => r.data)
export const updateTeam = (id: string, data: FormData) => api.put(`/team/${id}`, data).then(r => r.data)
export const deleteTeam = (id: string) => api.delete(`/team/${id}`).then(r => r.data)

// Certificates
export const getCertificates   = ()                            => api.get('/certificates').then(r => r.data)
export const createCertificate = (data: FormData)              => api.post('/certificates', data).then(r => r.data)
export const updateCertificate = (id: string, data: FormData)  => api.put(`/certificates/${id}`, data).then(r => r.data)
export const deleteCertificate = (id: string)                  => api.delete(`/certificates/${id}`).then(r => r.data)