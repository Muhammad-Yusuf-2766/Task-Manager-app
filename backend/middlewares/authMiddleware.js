const jwt = require('jsonwebtoken')
const UserSchema = require('../models/UserSchema')

// Middleware to protect routes
const isAuthenticated = async (req, res, next) => {
	try {
		let token = req.headers.authorization

		if (token && token.startsWith('Bearer')) {
			token = token.split(' ')[1] // Extract token from Bearer scheme
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			req.user = await UserSchema.findById(decoded.id).select('-password')
			next()
		} else {
			return res.status(401).json({ message: 'Not authorized, no token' })
		}
	} catch (error) {
		res.status(401).json({ message: 'Not authorized', error: error.message })
	}
}

// Middleware for Admin-only access
const isAdmin = (req, res, next) => {
	if (req.user && req.user.role === 'admin') {
		next()
	} else {
		res.status(403).json({ message: 'Access denied, admin only' })
	}
}

module.exports = {
	isAuthenticated,
	isAdmin,
}
