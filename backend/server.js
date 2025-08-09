require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const path = require('path')
const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')
const reportRoutes = require('./routes/reportRoutes')

// Middleware to handle cors
app.use(
	cors({
		origin: process.env.CLIENT_URL || 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)

// Connect to MongoDB
connectDB()

// Middleware to parse JSON bodies
app.use(express.json())
// uploads papkani static qilib ochish
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/report', reportRoutes)

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
