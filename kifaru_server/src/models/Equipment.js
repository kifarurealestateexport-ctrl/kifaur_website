const mongoose = require('mongoose')

const equipmentSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  quantity:  { type: Number, default: 1 },
  condition: { type: String, default: 'Good' },
  category:  { type: String, default: 'Equipment' }, // Vehicles, Machinery, Tools
  notes:     { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Equipment', equipmentSchema)
