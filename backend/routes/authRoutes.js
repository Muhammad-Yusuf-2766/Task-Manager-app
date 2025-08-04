const express = require('express')
const {
	registerUser,
	loginUser,
	getUserProfile,
	updateUserProfile,
} = require('../controllers/authController')
const { isAuthenticated } = require('../middlewares/authMiddleware')
const upload = require('../middlewares/uploadMiddleware')
const router = express.Router()

// Authentication routes
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', isAuthenticated, getUserProfile)
router.put('/profile', isAuthenticated, updateUserProfile)

router.post('/upload-profile-image', upload.single('image'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: 'No file uploaded' })
	}

	const profileImageUrl = `${req.protocol}://${req.get('host')}/uploads/${
		req.file.filename
	}`
	res.status(200).json({
		message: 'Profile image uploaded successfully',
		profileImageUrl,
	})
})

module.exports = router
