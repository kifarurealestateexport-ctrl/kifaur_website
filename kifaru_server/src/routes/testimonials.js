const express = require('express')
const router = express.Router()
const Testimonial = require('../models/Testimonial')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  try { res.json(await Testimonial.find().sort({ createdAt: -1 })) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', auth, async (req, res) => {
  try {
    const item = await Testimonial.create({ ...req.body, rating: Number(req.body.rating) || 5 })
    res.status(201).json(item)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, {
      ...req.body, rating: Number(req.body.rating) || 5
    }, { new: true })
    if (!updated) return res.status(404).json({ error: 'Not found' })
    res.json(updated)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try { await Testimonial.findByIdAndDelete(req.params.id); res.json({ success: true }) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
