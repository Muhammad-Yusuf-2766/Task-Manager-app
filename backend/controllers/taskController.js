const TaskSchema = require('../models/TaskSchema')
// Mongoose Document ichida ko‘plab qo‘shimcha metodlar va meta-ma'lumotlar bo‘ladi (save, isNew, validate, h.k.), lekin faqatgina asl data kerak bo‘lsa, task._doc ishlatiladi.

// @desc    Get all tasks for (Admin: all, User: assigned)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
	try {
		const { status } = req.query
		let filter = {}
		let tasks

		if (status) {
			filter.status = status
		}

		if (req.user.role === 'admin') {
			tasks = await TaskSchema.find(filter).populate(
				'assignedTo', // populates assignedTo with user details
				'name email profilePicture' // return only necessary fields
			)
		} else {
			tasks = await TaskSchema.find({
				...filter,
				assignedTo: req.user._id,
			}).populate(
				'assignedTo',
				'name email profilePicture' // return only necessary fields
			)
		}

		//  Add completed todoChecklist count to each task
		tasks = await Promise.all(
			tasks.map(async task => {
				const completedCount = task.todoChecklist.filter(
					item => item.completed
				).length
				return { ...task._doc, completedCount }
			})
		)

		// Status summary counts
		const allTasks = await TaskSchema.countDocuments(
			req.user.role === 'admin' ? {} : { assignedTo: req.user._id }
		)

		const pendingTasks = await TaskSchema.countDocuments({
			...filter,
			status: 'pending',
			...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
		})

		const inProgressTasks = await TaskSchema.countDocuments({
			...filter,
			status: 'in-progress',
			...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
		})

		const completedTasks = await TaskSchema.countDocuments({
			...filter,
			status: 'completed',
			...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
		})

		res.status(200).json({
			message: 'Tasks fetched successfully',
			tasks,
			statusSummary: {
				all: allTasks,
				pendingTasks,
				inProgressTasks,
				completedTasks,
			},
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
	try {
		const task = await TaskSchema.findById(req.params.id).populate(
			'assignedTo',
			'name email profilePicture'
		)

		if (!task) {
			return res.status(404).json({ message: 'Task not found' })
		}
		return res.json(task)
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Admin
const createTask = async (req, res) => {
	try {
		const {
			title,
			description,
			priority,
			dueDate,
			attechments,
			assignedTo,
			todoChecklist,
		} = req.body

		if (!Array.isArray(assignedTo)) {
			return res
				.status(400)
				.json({ message: 'assinedTo must be an array of user IDs' })
		}

		const newTask = await TaskSchema.create({
			title,
			description,
			priority,
			dueDate,
			assignedTo,
			createdBy: req.user._id, // Assuming req.user is populated with the authenticated user
			todoChecklist,
			attechments: attechments || [],
		})

		res.status(201).json({
			message: 'Task created successfully',
			task: newTask,
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc    Update a task by ID
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
	try {
		const task = await TaskSchema.findById(req.params.id)
		if (!task) {
			return res.status(404).json({ message: 'Task not found' })
		}

		const {
			title,
			description,
			priority,
			dueDate,
			attechments,
			assignedTo,
			todoChecklist,
		} = req.body

		if (!Array.isArray(assignedTo)) {
			return res
				.status(400)
				.json({ message: 'assignedTo must be an array of user IDs' })
		}

		task.title = title || task.title
		task.description = description || task.description
		task.priority = priority || task.priority
		task.dueDate = dueDate || task.dueDate
		task.attechments = attechments || task.attechments
		task.assignedTo = assignedTo || task.assignedTo
		task.todoChecklist = todoChecklist || task.todoChecklist

		const updatedTask = await task.save()
		res.status(200).json({
			message: 'Task updated successfully',
			updatedTask,
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc    Delete a task by ID
// @route   DELETE /api/tasks/:id
// @access  Admin
const deleteTask = async (req, res) => {
	try {
		const task = await TaskSchema.findByIdAndDelete(req.params.id)
		if (!task) {
			return res.status(404).json({ message: 'Task not found' })
		}
		res.status(200).json({ message: 'Task deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc    Update task status by ID
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
	try {
		const task = await TaskSchema.findById(req.params.id)
		if (!task) {
			return res.status(404).json({ message: 'Task not found' })
		}

		const isAssinedToUser = task.assignedTo.some(
			userId => userId.toString() === req.user._id.toString()
		)

		if (!isAssinedToUser && req.user.role !== 'admin') {
			return res
				.status(403)
				.json({ message: 'You are not authorized to update this task' })
		}

		task.status = req.body.status || task.status
		if (task.status === 'completed') {
			task.todoChecklist.forEach(item => {
				item.completed = true // Mark all todos as completed when task is completed
			})
			task.progress = 100 // Set progress to 100% when task is completed
		}

		await task.save()
		res.status(200).json({
			message: 'Task status updated',
			task,
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc    Update task checklist by ID
// @route   PUT /api/tasks/:id/todo
// @access  Private
const updateTaskChecklist = async (req, res) => {
	try {
		const { todoChecklist } = req.body
		const task = await TaskSchema.findById(req.params.id)
		if (!task) {
			return res.status(404).json({ message: 'Task not found' })
		}
		if (!task.assignedTo.includes(req.user._id) && req.user.role !== 'admin') {
			return res
				.status(403)
				.json({ message: 'You are not authorized to update this task' })
		}

		task.todoChecklist = todoChecklist || task.todoChecklist
		// Auto Calculate and update progress percentage
		const completedTodos = task.todoChecklist.filter(
			item => item.completed
		).length
		const totalTodos = task.todoChecklist.length
		task.progress = totalTodos
			? Math.round((completedTodos / totalTodos) * 100)
			: 0

		// Auto-update task status based on progress
		if (task.progress === 100) {
			task.status = 'completed'
		} else if (task.progress > 0) {
			task.status = 'in-progress'
		} else {
			task.status = 'pending'
		}

		await task.save()
		const updatedTask = await TaskSchema.findById(req.params.id).populate(
			'assignedTo',
			'name email profilePicture'
		)

		res.status(200).json({
			message: 'Task checklist updated successfully',
			task: updatedTask,
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc   Dashboard data (only Admin)
// @route  GET /api/tasks/dashboard-data
// @access Private
const getDashboardData = async (req, res) => {
	try {
		// Fetch statistics for the dashboard
		const totalTasks = await TaskSchema.countDocuments()
		const pendingTasks = await TaskSchema.countDocuments({
			status: 'pending',
		})
		const inProgressTasks = await TaskSchema.countDocuments({
			status: 'in-progress',
		})
		const completedTasks = await TaskSchema.countDocuments({
			status: 'completed',
		})
		const overdueTasks = await TaskSchema.countDocuments({
			dueDate: { $lt: new Date() }, // Little dueData from today
			status: { $ne: 'completed' }, // Exclude, Skip completed tasks
		})

		// Ensure all possible statuses are included
		const taskStatuses = ['pending', 'in-progress', 'completed']
		const taskDistributionRaw = await TaskSchema.aggregate([
			{
				$group: {
					_id: '$status',
					count: { $sum: 1 },
				},
			},
		])

		const taskDistribution = taskStatuses.reduce((acc, status) => {
			acc[status] =
				taskDistributionRaw.find(item => item._id === status)?.count || 0
			return acc
		}, {})
		taskDistribution['all'] = totalTasks

		// Ensure all possible priorities are included
		const taskPriorities = ['low', 'medium', 'high']
		const taskPriorityRaw = await TaskSchema.aggregate([
			{
				$group: {
					_id: '$priority',
					count: { $sum: 1 },
				},
			},
		])

		const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
			acc[priority] =
				taskPriorityRaw.find(item => item._id === priority)?.count || 0
			return acc
		}, {})

		// Fetch recent 10 tasks
		const recentTasks = await TaskSchema.find()
			.sort({ createdAt: -1 })
			.limit(10)
			.select('title status dueDate priority createdBy')

		res.status(200).json({
			statistics: {
				totalTasks,
				pendingTasks,
				inProgressTasks,
				completedTasks,
				overdueTasks,
			},
			charts: {
				taskDistribution,
				taskPriorityLevels,
			},
			recentTasks,
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc   User dashboard data (User-assigned)
// @route  GET /api/tasks/user-dashboard-data
// @access Private
const getUserDashboardData = async (req, res) => {
	try {
		const userId = req.user._id // Only fecth data for the authenticated user

		// Fetch statistics for the user-specific tasks
		const totalTasks = await TaskSchema.countDocuments({
			assignedTo: userId,
		})
		const pendingTasks = await TaskSchema.countDocuments({
			assignedTo: userId,
			status: 'pending',
		})
		const inProgressTasks = await TaskSchema.countDocuments({
			assignedTo: userId,
			status: 'in-progress',
		})
		const completedTasks = await TaskSchema.countDocuments({
			assignedTo: userId,
			status: 'completed',
		})
		const overdueTasks = await TaskSchema.countDocuments({
			assignedTo: userId,
			dueDate: { $lt: new Date() }, // Little dueData from today
			status: { $ne: 'completed' }, // Exclude, Skip completed tasks
		})

		// Task distribution by status
		const taskStatuses = ['pending', 'in-progress', 'completed']
		const taskDistributionRaw = await TaskSchema.aggregate([
			{ $match: { assignedTo: userId } },
			{ $group: { _id: '$status', count: { $sum: 1 } } },
		])

		const taskDistribution = taskStatuses.reduce((acc, status) => {
			acc[status] =
				taskDistributionRaw.find(item => item._id === status)?.count || 0
			return acc
		}, {})
		taskDistribution['all'] = totalTasks

		// Task distribution by priority
		const taskPriorities = ['low', 'medium', 'high']
		const taskPriorityLevelsRaw = await TaskSchema.aggregate([
			{ $match: { assignedTo: userId } },
			{ $group: { _id: '$priority', count: { $sum: 1 } } },
		])

		const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
			acc[priority] =
				taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0
			return acc
		}, {})

		// Fetch recent 10 tasks for the logged-in user
		const recentTasks = await TaskSchema.find({ assignedTo: userId })
			.sort({ createdAt: -1 })
			.limit(10)
			.select('title status dueDate priority createdBy')

		res.status(200).json({
			statistics: {
				totalTasks,
				pendingTasks,
				inProgressTasks,
				completedTasks,
				overdueTasks,
			},
			charts: {
				taskDistribution,
				taskPriorityLevels,
			},
			recentTasks,
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

module.exports = {
	getTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
	updateTaskStatus,
	updateTaskChecklist,
	getDashboardData,
	getUserDashboardData,
}
