const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')

const ClientLogo = mongoose.model('ClientLogo', new mongoose.Schema({
  name: String, logo: String,
}, { timestamps: true }))

const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, '../../uploads')
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage })

router.get('/',        async (req, res) => { try { res.json(await ClientLogo.find().sort({ createdAt: 1 })) } catch(e) { res.status(500).json({ error: e.message }) } })
router.post('/',   auth, upload.single('logo'), async (req, res) => { try { res.json(await ClientLogo.create({ name: req.body.name, logo: req.file?.filename })) } catch(e) { res.status(500).json({ error: e.message }) } })
router.put('/:id', auth, upload.single('logo'), async (req, res) => { try { const u = await ClientLogo.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(u) } catch(e) { res.status(500).json({ error: e.message }) } })
router.delete('/:id', auth, async (req, res) => { try { await ClientLogo.findByIdAndDelete(req.params.id); res.json({ ok: true }) } catch(e) { res.status(500).json({ error: e.message }) } })

module.exports = router