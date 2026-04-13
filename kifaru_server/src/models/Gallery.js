const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({
  title:    { type: String, default: '' },
  category: { type: String, default: 'General' }, // Projects, Paving, Team, Activities
  image:    { type: String, required: true },
  order:    { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Gallery', gallerySchema)
