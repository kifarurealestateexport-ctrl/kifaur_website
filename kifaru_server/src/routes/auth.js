const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    return res.json({ token, username, role: 'admin' })
  }
  res.status(401).json({ error: 'Invalid credentials' })
})

module.exports = router
