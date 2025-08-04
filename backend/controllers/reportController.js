const UserSchema = require('../models/UserSchema')
const TaskSchema = require('../models/TaskSchema')
const excelJS = require('exceljs')

// === !!!  .lean() — bu Mongoose’dan ma’lumot olganda, faqat toza datani qaytaradi, ortiqcha metodlar va yuklarsiz. Mongoose Document nima edi? Mongoose modeldan ma’lumot olsangiz, u odatda “Document” bo‘ladi — unda quyidagilar mavjud: faqatgina data emas, balki: .save() .populate() .isModified() .validate() va boshqa metodlar Bu qo‘shimcha funksiyalar ko‘proq xotira va vaqt talab qiladi. !!! === //

// @desc Export tasks report
// @route GET /api/report/export/tasks
// @access Private/Admin
const exportTasksreport = async (req, res) => {
	try {
		const tasks = await TaskSchema.find().populate('assignedTo', 'name email')

		const workbook = new excelJS.Workbook()
		const worksheet = workbook.addWorksheet('Tasks Report')

		worksheet.columns = [
			{ header: 'Task ID', key: '_id', width: 25 },
			{ header: 'Title', key: 'title', width: 30 },
			{ header: 'Description', key: 'description', width: 50 },
			{ header: 'Priority', key: 'priority', width: 15 },
			{ header: 'Status', key: 'status', width: 20 },
			{ header: 'Due Date', key: 'dueDate', width: 20 },
			{ header: 'Assigned To', key: 'assignedTo', width: 30 },
		]

		tasks.forEach(task => {
			const assignedTo = task.assignedTo
				.map(user => `${user.name} (${user.email})`)
				.join(', ')

			worksheet.addRow({
				_id: task._id,
				title: task.title,
				description: task.description,
				priority: task.priority,
				status: task.status,
				dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '', // Format date to YYYY-MM-DD
				assignedTo: assignedTo || 'Unassigned',
			})
		})
		worksheet.getRow(1).font = { bold: true } // Make header row bold

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		)
		res.setHeader(
			'Content-Disposition',
			'attachment; filename=tasks_report.xlsx'
		)

		return workbook.xlsx
			.write(res)
			.then(() => {
				res.status(200).end()
			})
			.catch(error => {
				res
					.status(500)
					.json({ message: 'Error generating report', error: error.message })
			})
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

// @desc Export users report
// @route GET /api/report/export/users
// @access Private/Admin
const exportUsersReport = async (req, res) => {
	try {
		const users = await UserSchema.find().select('name email _id').lean()
		const userTasks = await TaskSchema.find().populate(
			'assignedTo',
			'name email'
		)

		const userTaskMap = {}	
		users.forEach(async user => {
			userTaskMap[user._id] = {
				name: user.name,
				email: user.email,
				taskCount: 0,
				pendingTasks: 0,
				inProgressTasks: 0,
				completedTasks: 0,
			}

			userTasks.forEach(task => {
				if (task.assignedTo) {
					task.assignedTo.forEach(assignedUser => {
						if(userTaskMap[assignedUser])
		const workbook = new excelJS.Workbook()
		const worksheet = workbook.addWorksheet('Users Report')

		worksheet.columns = [
			{ header: 'User ID', key: '_id', width: 25 },
			{ header: 'Name', key: 'name', width: 30 },
			{ header: 'Email', key: 'email', width: 30 },
			{ header: 'Role', key: 'role', width: 20 },
		]

		users.forEach(user => {
			worksheet.addRow({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			})
		})
		worksheet.getRow(1).font = { bold: true } // Make header row bold

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		)
		res.setHeader(
			'Content-Disposition',
			'attachment; filename=users_report.xlsx'
		)

		try {
				await workbook.xlsx
					.write(res)
				res.status(200).end()
			} catch (error) {
				res
					.status(500)
					.json({ message: 'Error generating report', error: error.message })
			}
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

//
