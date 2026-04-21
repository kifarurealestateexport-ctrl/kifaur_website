const express = require('express')
const router = express.Router()
const Settings = require('../models/Settings')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

const DEFAULT_HOMEPAGE = {
  heroBadge:    'Dar es Salaam · Arusha · Dodoma',
  heroTitle:    'Build Your Dream Home\nPay Afterwards',
  heroSubtitle: "Tanzania's trusted construction and real estate company since 2007.",
  statYears:    '17+',
  statProjects: '30+',
  statCities:   '3',
  statClients:  '100+',
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

// POST /api/settings/logo — upload logo to Cloudinary
router.post('/logo', auth, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    // req.file.path is the full Cloudinary URL
    // Save it to settings so the frontend can retrieve it
    const doc = await Settings.findOneAndUpdate(
      { key: 'homepage' },
      { $set: { 'value.logoFilename': req.file.path } },
      { upsert: true, new: true }
    )
    res.json({ success: true, filename: req.file.path })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router