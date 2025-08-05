const express = require('express')
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware')
const {
	exportTasksreport,
	exportUsersReport,
} = require('../controllers/reportController')
const router = express.Router()

// Report routes
router.get('/export/tasks', isAuthenticated, isAdmin, exportTasksreport)
router.get('/export/users', isAuthenticated, isAdmin, exportUsersReport)

module.exports = router
