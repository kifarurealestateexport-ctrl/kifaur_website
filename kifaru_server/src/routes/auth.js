const express = require('express')
const jwt     = require('jsonwebtoken')
const router  = express.Router()
const Admin   = require('../models/Admin')

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password, email } = req.body
    const loginEmail = (email || username || '').toLowerCase().trim()

    if (!loginEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const admin = await Admin.findOne({ email: loginEmail })
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, email: admin.email, name: admin.name, role: admin.role })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ error: 'Login failed. Please try again.' })
  }
})

// POST /api/auth/change-password
const auth = require('../middleware/auth')
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both passwords are required' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }
    const admin = await Admin.findById(req.user.id)
    if (!admin) return res.status(404).json({ error: 'Admin not found' })
    const isMatch = await admin.comparePassword(currentPassword)
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' })
    admin.password = newPassword
    await admin.save()
    res.json({ success: true, message: 'Password changed successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router