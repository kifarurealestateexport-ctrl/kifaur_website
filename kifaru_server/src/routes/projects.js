const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

router.get('/', async (req, res) => {
  try { res.json(await Project.find().sort({ createdAt: -1 })) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const item = await Project.create({ ...req.body, image: req.file?.filename || req.body.image || '' })
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const updated = await Project.findByIdAndUpdate(req.params.id, {
      ...req.body,
      image: req.file?.filename || existing.image
    }, { new: true })
    res.json(updated)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try { await Project.findByIdAndDelete(req.params.id); res.json({ success: true }) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
