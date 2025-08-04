const multer = require('multer')

//  OCnfigure Strorage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/')
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`)
	},
})

// File filter to allow only images
const fileFilter = (req, file, cb) => {
	const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
	if (allowedTypes.includes(file.mimetype)) {
		return cb(null, true)
	} else {
		cb(new Error('Only .jpg, .jpeg, .png format images are allowed'), false)
	}
}

const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
	fileFilter: fileFilter,
})

module.exports = upload
