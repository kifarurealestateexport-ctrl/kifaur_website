const mongoose = require('mongoose')

const certificateSchema = new mongoose.Schema({
  label:  { type: String, required: true },
  detail: { type: String, default: '' },
  sub:    { type: String, default: '' },
  image:  { type: String, default: '' },
  order:  { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Certificate', certificateSchema)