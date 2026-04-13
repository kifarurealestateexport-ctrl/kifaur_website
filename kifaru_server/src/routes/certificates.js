const express = require('express')
const router  = express.Router()
const Certificate = require('../models/Certificate')
const auth    = require('../middleware/auth')
const upload  = require('../middleware/upload')

// GET /api/certificates — public
router.get('/', async (req, res) => {
  try { res.json(await Certificate.find().sort({ order: 1, createdAt: 1 })) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /api/certificates — admin, with image upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const item = await Certificate.create({
      ...req.body,
      image: req.file?.filename || '',
      order: Number(req.body.order) || 0,
    })
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// PUT /api/certificates/:id — admin, replace image
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const existing = await Certificate.findById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const updated = await Certificate.findByIdAndUpdate(req.params.id, {
      ...req.body,
      image: req.file?.filename || existing.image,
      order: Number(req.body.order) || existing.order,
    }, { new: true })
    res.json(updated)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

// DELETE /api/certificates/:id — admin
router.delete('/:id', auth, async (req, res) => {
  try { await Certificate.findByIdAndDelete(req.params.id); res.json({ success: true }) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router