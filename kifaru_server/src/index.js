require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const path       = require('path')
const fs         = require('fs')
const connectDB  = require('./config/db')

const app = express()
connectDB()

const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, '../../uploads')
fs.mkdirSync(uploadsDir, { recursive: true })
console.log('✅ Serving uploads from:', uploadsDir)

// ✅ All allowed origins including both your production domains
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://kifaur-website.vercel.app',
  'https://www.kifarugroup.co.tz',
  'https://kifarugroup.co.tz',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn('🚫 CORS blocked:', origin)
      callback(new Error(`CORS blocked: ${origin}`))
    }
  },
  credentials: true
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use('/uploads', express.static(uploadsDir))

// TEMPORARY SEED ROUTE - REMOVE AFTER USE
app.get('/seed-admin-once', async (req, res) => {
  const secret = req.query.secret
  if (secret !== process.env.SEED_SECRET) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  try {
    const Admin = require('./models/Admin')
    await Admin.deleteMany({})
    await Admin.create({
      email:    process.env.ADMIN_EMAIL    || 'admin@kifarugroup.co.tz',
      password: process.env.ADMIN_PASSWORD || 'Admin@kifaru2026',
      name:     'Kifaru Administrator',
      role:     'admin',
    })
    res.json({ success: true, message: '✅ Admin seeded successfully!' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.use('/api/auth',         require('./routes/auth'))
app.use('/api/properties',   require('./routes/properties'))
app.use('/api/bookings',     require('./routes/bookings'))
app.use('/api/services',     require('./routes/services'))
app.use('/api/projects',     require('./routes/projects'))
app.use('/api/testimonials', require('./routes/testimonials'))
app.use('/api/floorplans',   require('./routes/floorplans'))
app.use('/api/agents',       require('./routes/agents'))
app.use('/api/settings',     require('./routes/settings'))
app.use('/api/equipment',    require('./routes/equipment'))
app.use('/api/gallery',      require('./routes/gallery'))
app.use('/api/certificates', require('./routes/certificates'))
app.use('/api/team',         require('./routes/team'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'mongodb' }))
app.use((req, res) => res.status(404).json({ error: 'Route not found' }))
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message })
})

const PORT = process.env.PORT || 5001
const server = app.listen(PORT, () => {
  console.log(`\n🦏 Kifaru Server → http://localhost:${PORT}`)
  console.log(`📁 Uploads     → http://localhost:${PORT}/uploads`)
  console.log(`🔑 Admin       → ${process.env.ADMIN_USERNAME} / ${process.env.ADMIN_PASSWORD}\n`)
})
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is in use. Change PORT in .env\n`)
    process.exit(1)
  } else throw err
})