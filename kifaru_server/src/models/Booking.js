const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  service: { type: String, required: true },
  location: { type: String, default: '' },
  message: { type: String, default: '' },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)
