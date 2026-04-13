const express = require('express')
const router  = express.Router()
const Service = require('../models/Service')
const { SERVICE_CATEGORIES } = require('../models/Service')
const auth    = require('../middleware/auth')
const upload  = require('../middleware/upload')

// GET /api/services — public (optionally filter by category)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {}
    const items  = await Service.find(filter).sort({ category: 1, order: 1, createdAt: 1 })
    res.json(items)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/services/categories — returns the list of valid categories
router.get('/categories', (req, res) => {
  res.json(SERVICE_CATEGORIES)
})

// POST /api/services
router.post('/', auth, upload.array('images', 6), async (req, res) => {
  try {
    const images = req.files?.map(f => f.filename) || []
    const item   = await Service.create({ ...req.body, images, order: Number(req.body.order) || 0 })
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// PUT /api/services/:id
router.put('/:id', auth, upload.array('images', 6), async (req, res) => {
  try {
    const existing = await Service.findById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const newImgs = req.files?.map(f => f.filename) || []
    const images  = newImgs.length ? [...existing.images, ...newImgs] : existing.images
    const updated = await Service.findByIdAndUpdate(req.params.id, { ...req.body, images }, { new: true, runValidators: true })
    res.json(updated)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// DELETE /api/services/:id
router.delete('/:id', auth, async (req, res) => {
  try { await Service.findByIdAndDelete(req.params.id); res.json({ success: true }) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router