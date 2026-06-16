const multer = require('multer')
const cloudinary = require('cloudinary').v2
const path = require('path')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadToCloudinary = (buffer, originalname) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'kifaru',
        public_id: `${Date.now()}-${path.parse(originalname).name}`,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (err, result) => err ? reject(err) : resolve(result.secure_url)
    ).end(buffer)
  })
const memUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // increase to 50MB
})

const afterUpload = async (req, res, next) => {
  try {
    const files = req.files?.length ? req.files : req.file ? [req.file] : []
    if (!files.length) return next()
    const urls = await Promise.all(files.map(f => uploadToCloudinary(f.buffer, f.originalname)))
    if (req.files?.length) req.files = req.files.map((f, i) => ({ ...f, path: urls[i] }))
    if (req.file) req.file.path = urls[0]
    next()
  } catch (err) { next(err) }
}

module.exports = {
  single: (field) => [memUpload.single(field), afterUpload],
  array:  (field, max = 10) => [memUpload.array(field, max), afterUpload],
}