const express = require('express')
const router = express.Router()
const Agent = require('../models/Agent')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

router.get('/', async (req, res) => {
  try { res.json(await Agent.find().sort({ createdAt: 1 })) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const item = await Agent.create({ ...req.body, photo: req.file?.filename || '' })
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const existing = await Agent.findById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const updated = await Agent.findByIdAndUpdate(req.params.id, {
      ...req.body, photo: req.file?.filename || existing.photo
    }, { new: true })
    res.json(updated)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try { await Agent.findByIdAndDelete(req.params.id); res.json({ success: true }) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
