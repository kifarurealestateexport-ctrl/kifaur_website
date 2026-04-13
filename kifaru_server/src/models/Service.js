const mongoose = require('mongoose')

const SERVICE_CATEGORIES = [
  'Residential Construction',
  'Commercial Buildings',
  'Paving & Kerbstones',
  'Landscaping',
  'Electrical Works',
  'Joinery & Carpentry',
  'Real Estate',
  'Other',
]

const serviceSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, enum: SERVICE_CATEGORIES, required: true },
  description: { type: String, default: '' },
  tag:         { type: String, default: '' },
  images:      [{ type: String }],
  order:       { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Service', serviceSchema)
module.exports.SERVICE_CATEGORIES = SERVICE_CATEGORIES