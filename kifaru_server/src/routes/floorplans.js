const express = require('express')
const router = express.Router()
const FloorPlan = require('../models/FloorPlan')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

router.get('/', async (req, res) => {
  try { res.json(await FloorPlan.find().sort({ createdAt: 1 })) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', auth, upload.array('images', 4), async (req, res) => {
  try {
    const images = req.files?.map(f => f.filename) || []
    const item = await FloorPlan.create({
      ...req.body,
      bedrooms: req.body.bedrooms ? Number(req.body.bedrooms) : undefined,
      bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : undefined,
      area: req.body.area ? Number(req.body.area) : undefined,
      images,
    })
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', auth, upload.array('images', 4), async (req, res) => {
  try {
    const existing = await FloorPlan.findById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const newImgs = req.files?.map(f => f.filename) || []
    const images = newImgs.length ? [...existing.images, ...newImgs] : existing.images
    const updated = await FloorPlan.findByIdAndUpdate(req.params.id, { ...req.body, images }, { new: true })
    res.json(updated)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try { await FloorPlan.findByIdAndDelete(req.params.id); res.json({ success: true }) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
