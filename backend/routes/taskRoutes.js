const express = require('express')
const { isAuthenticated } = require('../middlewares/authMiddleware')
const {
	getDashboardData,
	getUserDashboardData,
	getTasks,
	getTaskById,
	createTask,
	deleteTask,
	updateTaskStatus,
	updateTaskChecklist,
	updateTask,
} = require('../controllers/taskController')
const router = express.Router()

// Task Management routes
router.get('/dashboard-data', isAuthenticated, getDashboardData)
router.get('/user-dashboard-data', isAuthenticated, getUserDashboardData)
router.get('/', isAuthenticated, getTasks) // Get all tasks (Admin: all, User: assigned)
router.get('/:id', isAuthenticated, getTaskById) // Get task by ID
router.post('/', isAuthenticated, createTask) // Create a new task
router.put('/:id', isAuthenticated, updateTask) // Update a task by ID
router.delete('/:id', isAuthenticated, deleteTask) // Delete a task by ID
router.put('/:id/status', isAuthenticated, updateTaskStatus) // Update task status by ID
router.put('/:id/todo', isAuthenticated, updateTaskChecklist) // Update task todo by ID

module.exports = router
