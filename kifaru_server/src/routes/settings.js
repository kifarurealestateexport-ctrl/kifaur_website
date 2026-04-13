const express = require('express')
const router = express.Router()
const Settings = require('../models/Settings')
const auth = require('../middleware/auth')

const DEFAULT_HOMEPAGE = {
  heroBadge: 'Dar es Salaam · Arusha · Dodoma',
  heroTitle: 'Build Your Dream Home\nPay Afterwards',
  heroSubtitle: "Tanzania's trusted construction and real estate company since 2007.",
  statYears: '17+', statProjects: '50+', statCities: '3', statClients: '200+',
}

router.get('/homepage', async (req, res) => {
  try {
    const doc = await Settings.findOne({ key: 'homepage' })
    res.json(doc ? doc.value : DEFAULT_HOMEPAGE)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.put('/homepage', auth, async (req, res) => {
  try {
    const doc = await Settings.findOneAndUpdate(
      { key: 'homepage' },
      { value: req.body },
      { upsert: true, new: true }
    )
    res.json(doc.value)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

module.exports = router

// POST /api/settings/logo — upload logo file
const upload = require('../middleware/upload')
const path = require('path')
const fs = require('fs')

router.post('/logo', auth, upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  // Rename to logo.png/svg etc for easy serving
  const ext = path.extname(req.file.originalname) || '.png'
  const dest = path.join(__dirname, '../../uploads/logo' + ext)
  // Remove old logos
  ['logo.png','logo.jpg','logo.svg','logo.webp'].forEach(f => {
    const p = path.join(__dirname, '../../uploads/', f)
    if (fs.existsSync(p)) try { fs.unlinkSync(p) } catch {}
  })
  fs.renameSync(req.file.path, dest)
  res.json({ success: true, filename: 'logo' + ext })
})
