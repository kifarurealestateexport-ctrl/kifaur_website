/**
 * Run once to create admin user in MongoDB:
 *   node src/seedAdmin.js
 */
require('dotenv').config()
const mongoose = require('mongoose')
const Admin    = require('./models/Admin')

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    await Admin.deleteMany({})
    console.log('🗑  Cleared old admin users')

    await Admin.create({
      email:    'admin@kifarugroup.co.tz',
      password: 'Admin@kifaru2026',
      name:     'Kifaru Administrator',
      role:     'admin',
    })

    console.log('\n Admin user created!')
    console.log('   Email   : admin@kifarugroup.co.tz')
    console.log('   Password: Admin@kifaru2026')
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

seed()