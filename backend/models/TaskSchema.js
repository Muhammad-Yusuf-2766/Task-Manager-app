const { text } = require('express')
const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
	text: { type: String, required: true },
	completed: { type: Boolean, default: false },
})

const taskSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		priority: {
			type: String,
			enum: ['low', 'medium', 'high'],
			default: 'medium',
		},
		status: {
			type: String,
			enum: ['pending', 'in-progress', 'completed'],
			default: 'pending',
		},
		dueDate: { type: Date, required: true },
		assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		attechments: [{ type: String }], // URLs or paths to files
		todoChecklist: [todoSchema], // Embedded sub-document for todos
		progress: { type: Number, default: 0 }, // Progress percentage
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Task', taskSchema)
