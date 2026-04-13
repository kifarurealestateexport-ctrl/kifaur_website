const express = require('express')
const router = express.Router()
const Equipment = require('../models/Equipment')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  try { res.json(await Equipment.find().sort({ category: 1, name: 1 })) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', auth, async (req, res) => {
  try { res.status(201).json(await Equipment.create(req.body)) }
  catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const u = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!u) return res.status(404).json({ error: 'Not found' })
    res.json(u)
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try { await Equipment.findByIdAndDelete(req.params.id); res.json({ success: true }) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
