const express = require('express')
const router = express.Router()

// Authentication routes
router.post('register', registerUser)
router.post('login', loginUser)
router.get('/profile', authenticate, getUserProfile)
router.put('/profile', authenticate, updateUserProfile)

module.exports = router
