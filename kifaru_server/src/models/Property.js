const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  location:    { type: String, required: true },
  images:      [{ type: String }],
  featured:    { type: Boolean, default: false },
  tags:        [{ type: String }],
}, { timestamps: true })

module.exports = mongoose.model('Property', propertySchema)