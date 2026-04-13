const mongoose = require('mongoose')

const floorPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, default: '' },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  area: { type: Number },
  price: { type: String, default: '' },
  note: { type: String, default: '' },
  images: [{ type: String }],
}, { timestamps: true })

module.exports = mongoose.model('FloorPlan', floorPlanSchema)
