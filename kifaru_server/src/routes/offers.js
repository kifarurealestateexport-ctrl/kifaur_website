const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

const Offer = mongoose.model('Offer', new mongoose.Schema({
  type:      { type: String, default: 'offer' },
  title:     String,
  body:      String,
  badge:     String,
  color:     String,
  link:      String,
  linkLabel: String,
  image:     String,
}, { timestamps: true }))

router.get('/', async (req, res) => {
  try { res.json(await Offer.find().sort({ createdAt: -1 })) }
  catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    res.json(await Offer.create({ ...req.body, image: req.file?.path || '' }))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const existing = await Offer.findById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const u = await Offer.findByIdAndUpdate(req.params.id, {
      ...req.body,
      image: req.file?.path || existing.image,
    }, { new: true })
    res.json(u)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try { await Offer.findByIdAndDelete(req.params.id); res.json({ ok: true }) }
  catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router