const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  speciality: { type: String, default: '' },
  experience: { type: String, default: '' },
  photo: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Agent', agentSchema)
