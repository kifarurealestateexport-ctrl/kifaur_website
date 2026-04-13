const express = require('express')
const router = express.Router()
const Gallery = require('../models/Gallery')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

router.get('/', async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {}
    res.json(await Gallery.find(filter).sort({ order: 1, createdAt: -1 }))
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image required' })
    res.status(201).json(await Gallery.create({ ...req.body, image: req.file.filename }))
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try { await Gallery.findByIdAndDelete(req.params.id); res.json({ success: true }) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
