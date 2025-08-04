const express = require('express')
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware')
const {
	getAllUsers,
	getUserById,
	deleteUser,
} = require('../controllers/userController')
const router = express.Router()

// User management routes
router.get('/', isAuthenticated, isAdmin, getAllUsers)
router.get('/:id', isAuthenticated, getUserById) // get specific user by
router.delete('/:id', isAuthenticated, isAdmin, deleteUser) // delete user by id

module.exports = router
