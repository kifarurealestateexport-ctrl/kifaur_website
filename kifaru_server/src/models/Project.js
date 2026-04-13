const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: '' },
  year: { type: String, default: '' },
  status: { type: String, enum: ['Completed', 'Ongoing'], default: 'Completed' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)
