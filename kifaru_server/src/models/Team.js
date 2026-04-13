const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  title:       { type: String, required: true },
  department:  { type: String, default: '' },
  description: { type: String, default: '' },
  photo:       { type: String, default: '' },
  order:       { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Team', teamSchema)