const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const UPLOADS_DIR = path.join(__dirname, '../../../uploads')
fs.mkdirSync(UPLOADS_DIR, { recursive: true })
console.log('✅ Uploads dir:', UPLOADS_DIR)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename:    (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
})

// ✅ No fileFilter — removing it fixes req.body being empty when no file is attached
module.exports = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } })