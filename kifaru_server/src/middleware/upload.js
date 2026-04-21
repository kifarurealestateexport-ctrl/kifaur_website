const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const path = require('path')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:          'kifaru',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'],
    public_id:       `${Date.now()}-${path.parse(file.originalname).name}`,
    transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
  }),
})

module.exports = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
})