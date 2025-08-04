require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const path = require('path')
const connectDB = require('./config/db')

// Middleware to handle cors
app.use(
	cors({
		origin: process.env.CLIET_URL || 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)

// Connect to MongoDB
connectDB()

// Middleware to parse JSON bodies
app.use(express.json())

// Routes
// app.use('/api/auth', require(authRoutes))
// app.use('/api/users', require(userRoutes))
// app.use('/api/tasks', require(taskRoutes))
// app.use('/api/report', require(reportRoutes))

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
