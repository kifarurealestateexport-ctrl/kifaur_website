const express = require('express')
const router  = express.Router()
const Booking = require('../models/Booking')
const auth    = require('../middleware/auth')
const { sendBookingEmails } = require('../services/emailService')

// POST /api/bookings — public (visitor form submission)
router.post('/', async (req, res) => {
  try {
    const { name, firstName, lastName, phone, email, service, location, message, propertyId } = req.body

    if (!phone || !service) {
      return res.status(400).json({ error: 'Phone and service are required' })
    }

    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim()

    // Save to database
    const item = await Booking.create({
      name:      fullName,
      phone,
      email:     email || '',
      service,
      location:  location || '',
      message:   message  || '',
      propertyId: propertyId || null,
    })

    // Send emails (non-blocking — don't fail the booking if email fails)
    sendBookingEmails({
      name:     fullName,
      phone,
      email:    email || '',
      service,
      location: location || '',
      message:  message  || '',
    }).then(result => {
      if (!result.success) {
        console.warn('Email sending had errors:', result.errors)
      }
    }).catch(err => {
      console.error('Email send error:', err.message)
    })

    res.status(201).json({
      ...item.toObject(),
      emailSent: !!(email && email.includes('@')),
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET /api/bookings — admin only
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate('propertyId', 'title')
    res.json({ bookings, total: bookings.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/bookings/:id — admin update status
router.patch('/:id', auth, async (req, res) => {
  try {
    const item = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.json(item)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/bookings/:id — admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router