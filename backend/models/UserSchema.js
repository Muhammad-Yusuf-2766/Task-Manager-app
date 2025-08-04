const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profileImageUrl: { type: String, default: '' },
		role: { type: String, enum: ['member', 'admin'], default: 'member' }, // Role based access control
		// createdAt: { type: Date, default: Date.now },
		// updatedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
