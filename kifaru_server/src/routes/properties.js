const express  = require('express')
const router   = express.Router()
const Property = require('../models/Property')
const auth     = require('../middleware/auth')
const upload   = require('../middleware/upload')

router.get('/', async (req, res) => {
  try {
    const { q, featured, limit = 50 } = req.query
    const filter = {}
    if (featured === 'true') filter.featured = true
    if (q) {
      const re = new RegExp(q, 'i')
      filter.$or = [{ title: re }, { location: re }, { description: re }]
    }
    const items = await Property.find(filter).sort({ createdAt: -1 }).limit(Number(limit))
    res.json({ properties: items, total: items.length })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.get('/:id', async (req, res) => {
  try {
    const item = await Property.findById(req.params.id)
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.json(item)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', auth, ...upload.array('images', 10), async (req, res) => {
  try {
    const images = req.files?.map(f => f.path) || []
    const item = await Property.create({
      title:       req.body.title,
      description: req.body.description || '',
      location:    req.body.location,
      featured:    req.body.featured === 'true',
      images,
    })
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', auth, ...upload.array('images', 10), async (req, res) => {
  try {
    const existing = await Property.findById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const newImages = req.files?.map(f => f.path) || []
    const images    = newImages.length ? [...existing.images, ...newImages] : existing.images
    const updated = await Property.findByIdAndUpdate(req.params.id, {
      title:       req.body.title       || existing.title,
      description: req.body.description || existing.description,
      location:    req.body.location    || existing.location,
      featured:    req.body.featured === 'true',
      images,
    }, { new: true })
    res.json(updated)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try { await Property.findByIdAndDelete(req.params.id); res.json({ success: true }) }
  catch (err) { res.status(500).json({ error: err.message }) }
})


module.exports = router