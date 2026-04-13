const express = require('express')
const router = express.Router()
const Property = require('../models/Property')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

// GET /api/properties
router.get('/', async (req, res) => {
  try {
    const { type, status, q, featured, minPrice, maxPrice, bedrooms, limit = 50 } = req.query
    const filter = {}
    if (type) filter.type = type
    if (status) filter.status = status
    if (featured === 'true') filter.featured = true
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) }
    if (q) {
      const re = new RegExp(q, 'i')
      filter.$or = [{ title: re }, { location: re }, { type: re }, { description: re }]
    }
    const items = await Property.find(filter).sort({ createdAt: -1 }).limit(Number(limit))
    res.json({ properties: items, total: items.length })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/properties/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Property.findById(req.params.id)
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /api/properties
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    const images = req.files?.map(f => f.filename) || []
    const item = await Property.create({
      ...req.body,
      price: Number(req.body.price),
      bedrooms: req.body.bedrooms ? Number(req.body.bedrooms) : undefined,
      bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : undefined,
      area: req.body.area ? Number(req.body.area) : undefined,
      featured: req.body.featured === 'true',
      images,
    })
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// PUT /api/properties/:id
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    const existing = await Property.findById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const newImages = req.files?.map(f => f.filename) || []
    const images = newImages.length ? [...existing.images, ...newImages] : existing.images
    const updated = await Property.findByIdAndUpdate(req.params.id, {
      ...req.body,
      price: Number(req.body.price || existing.price),
      bedrooms: req.body.bedrooms ? Number(req.body.bedrooms) : existing.bedrooms,
      bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : existing.bathrooms,
      area: req.body.area ? Number(req.body.area) : existing.area,
      featured: req.body.featured === 'true',
      images,
    }, { new: true })
    res.json(updated)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// DELETE /api/properties/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
