const express = require('express')
const router  = express.Router()
const Team    = require('../models/Team')
const auth    = require('../middleware/auth')
const upload  = require('../middleware/upload')

router.get('/', async (req, res) => {
  try { res.json(await Team.find().sort({ order: 1, createdAt: 1 })) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const member = await Team.create({
      name:        req.body.name,
      title:       req.body.title,
      department:  req.body.department  || '',
      description: req.body.description || '',
      order:       req.body.order ? Number(req.body.order) : 0,
      photo:       req.file?.path || '',
    })
    res.status(201).json(member)
  } catch (err) {
    console.error('Team POST error:', err.message)
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const existing = await Team.findById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    const updated = await Team.findByIdAndUpdate(req.params.id, {
      name:        req.body.name        || existing.name,
      title:       req.body.title       || existing.title,
      department:  req.body.department  ?? existing.department,
      description: req.body.description ?? existing.description,
      order:       req.body.order !== undefined ? Number(req.body.order) : existing.order,
      photo:       req.file?.path || existing.photo,
    }, { new: true })
    res.json(updated)
  } catch (err) {
    console.error('Team PUT error:', err.message)
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router