const express = require('express')
const router  = express.Router()
const path    = require('path')
const fs      = require('fs')
const Team    = require('../models/Team')
const auth    = require('../middleware/auth')
const upload  = require('../middleware/upload')

const UPLOADS_DIR = path.join(__dirname, '../../../uploads')

// GET /api/team
router.get('/', async (req, res) => {
  try {
    res.json(await Team.find().sort({ order: 1, createdAt: 1 }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/team
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const member = await Team.create({
      name:        req.body.name,
      title:       req.body.title,
      department:  req.body.department  || '',
      description: req.body.description || '',
      order:       req.body.order ? Number(req.body.order) : 0,
      photo:       req.file?.filename   || '',
    })
    res.status(201).json(member)
  } catch (err) {
    console.error('Team POST error:', err.message)
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/team/:id
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const existing = await Team.findById(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Not found' })

    const updated = await Team.findByIdAndUpdate(
      req.params.id,
      {
        name:        req.body.name        || existing.name,
        title:       req.body.title       || existing.title,
        department:  req.body.department  ?? existing.department,
        description: req.body.description ?? existing.description,
        order:       req.body.order !== undefined ? Number(req.body.order) : existing.order,
        photo:       req.file?.filename   || existing.photo,
      },
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    console.error('Team PUT error:', err.message)
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/team/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await Team.findById(req.params.id)
    if (!member) return res.status(404).json({ error: 'Not found' })

    if (member.photo) {
      const p = path.join(UPLOADS_DIR, member.photo)
      if (fs.existsSync(p)) try { fs.unlinkSync(p) } catch {}
    }

    await Team.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router