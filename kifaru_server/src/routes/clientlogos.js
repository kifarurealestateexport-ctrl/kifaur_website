const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

const ClientLogo = mongoose.model('ClientLogo', new mongoose.Schema({
  name: String,
  logo: String,
}, { timestamps: true }))

router.get('/', async (req, res) => {
  try { res.json(await ClientLogo.find().sort({ createdAt: 1 })) }
  catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/', auth, upload.single('logo'), async (req, res) => {
  try {
    res.json(await ClientLogo.create({ name: req.body.name, logo: req.file?.path || '' }))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.put('/:id', auth, upload.single('logo'), async (req, res) => {
  try {
    const existing = await ClientLogo.findById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const u = await ClientLogo.findByIdAndUpdate(req.params.id, {
      name: req.body.name ?? existing.name,
      logo: req.file?.path || existing.logo,
    }, { new: true })
    res.json(u)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try { await ClientLogo.findByIdAndDelete(req.params.id); res.json({ ok: true }) }
  catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router