const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const adminSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name:     { type: String, default: 'Administrator' },
  role:     { type: String, default: 'admin' },
}, { timestamps: true })

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare plain password with hash
adminSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password)
}

module.exports = mongoose.model('Admin', adminSchema)