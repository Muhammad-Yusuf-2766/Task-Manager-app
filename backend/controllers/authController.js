const UserSchema = require('../models/UserSchema')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = userId => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
		expiresIn: '1d',
	})
}

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
	try {
		const { name, email, password, profileImageUrl, adminInviteToken } =
			req.body
		// Check if user already exists
		const existingUser = await UserSchema.findOne({ email })
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' })
		}

		// Determine if the user is an admin
		let role = 'member'
		const isAdmin = adminInviteToken === process.env.ADMIN_INVITE_TOKEN
		if (isAdmin) {
			role = 'admin'
		}

		// Hash the password
		const salt = await bycrypt.genSalt(10)
		const hashedPassword = await bycrypt.hash(password, salt)

		// Create a new user
		const user = await UserSchema.create({
			name,
			email,
			password: hashedPassword,
			profileImageUrl,
			role,
		})

		// return user data and token
		const token = generateToken(user._id)
		res.status(201).json({
			id: user._id,
			user,
			token,
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc login a new user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body
		// Check if user exists
		const user = await UserSchema.findOne({ email })
		if (!user) {
			return res.status(400).json({ message: 'Invalid email' })
		}

		// Check password
		const isMatch = await bycrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid password' })
		}

		// Generate token
		const token = generateToken(user._id)
		res.status(200).json({
			id: user._id,
			user,
			token,
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc Get user Profile
// @route POST /api/auth/profile
// @access Private (requires jwt)
const getUserProfile = async (req, res) => {
	try {
		console.log('getUserProfile:')
		const user = await UserSchema.findById(req.user._id).select('-password')
		// Check if user exists
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		res.status(200).json(user)
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc Update user Profile
// @route PUT /api/auth/profile
// @access Private (requires jwt)
const updateUserProfile = async (req, res) => {
	try {
		const user = await UserSchema.findById(req.user.id)
		// Check if user exists
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		const { name, email, profileImageUrl } = req.body
		// Update user fields
		user.name = name || user.name
		user.email = email || user.email
		user.profileImageUrl = profileImageUrl || user.profileImageUrl

		// password
		if (req.body.password) {
			const salt = await bycrypt.genSalt(10)
			user.password = await bycrypt.hash(req.body.password, salt)
		}

		// Save updated user
		const updatedUser = await user.save()
		res.status(200).json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			profileImageUrl: updatedUser.profileImageUrl,
			role: updatedUser.role,
			token: generateToken(updatedUser._id),
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

module.exports = {
	registerUser,
	loginUser,
	getUserProfile,
	updateUserProfile,
	generateToken,
}
