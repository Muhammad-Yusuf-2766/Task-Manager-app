const UserSchema = require('../models/UserSchema')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = userId => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '1d',
	})
}

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {}

// @desc login a new user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {}

// @desc Get user Profile a new user
// @route POST /api/auth/profile
// @access Public
const User = async (req, res) => {}
