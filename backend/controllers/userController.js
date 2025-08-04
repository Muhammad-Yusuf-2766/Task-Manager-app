const TaskSchema = require('../models/TaskSchema')
const UserSchema = require('../models/UserSchema')
const bcrypt = require('bcryptjs')

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getAllUsers = async (req, res) => {
	try {
		const users = await UserSchema.find({ role: 'member' }).select('-password')

		//  Add task count to each user
		const usersWithTaskCount = await Promise.all(
			users.map(async user => {
				const pendingTasks = await TaskSchema.countDocuments({
					assignedTo: user._id,
					status: 'pending',
				})
				const inProgressTasks = await TaskSchema.countDocuments({
					assignedTo: user._id,
					status: 'in-progress',
				})
				const completedTasks = await TaskSchema.countDocuments({
					assignedTo: user._id,
					status: 'completed',
				})
				return {
					...user._doc, // Include all user fields
					pendingTasks,
					inProgressTasks,
					completedTasks,
				}
			})
		)
		res.status(200).json(usersWithTaskCount)
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private
const getUserById = async (req, res) => {
	try {
		const user = await UserSchema.findById(req.params.id)
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		res.status(200).json(user)
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc Delete user by ID
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = async (req, res) => {
	try {
		const user = await UserSchema.findByIdAndDelete(req.params.id)
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		res.status(200).json({ message: 'User deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

module.exports = {
	getAllUsers,
	getUserById,
	deleteUser,
}
