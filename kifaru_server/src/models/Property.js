const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  currency: { type: String, default: 'TZS' },
  type: { type: String, enum: ['house', 'apartment', 'land', 'commercial'], required: true },
  status: { type: String, enum: ['sale', 'rent'], required: true },
  location: { type: String, required: true },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  area: { type: Number },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
}, { timestamps: true })

module.exports = mongoose.model('Property', propertySchema)
