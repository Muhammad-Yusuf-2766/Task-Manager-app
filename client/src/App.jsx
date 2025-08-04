import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute'
import SignUp from './components/SignUp'
import MyTasks from './pages/User/MyTasks'
import UserDashboard from './pages/User/UserDashboard'
import ViewTaskDetails from './pages/User/ViewTaskDetails'

const App = () => {
	return (
		<div>
			<Router>
				<Routes>
					<Route path='/' element={<h1>Home Page</h1>} />
					<Route path='/login' element={<Login />} />
					<Route path='/signup' element={<SignUp />} />

					{/* === ADMIN Routes === */}
					<Route element={<PrivateRoute allowedRoles={['admin']} />}>
						<Route path='/admin/dashboard' element={<Dashboard />} />
						<Route path='/admin/tasks' element={<ManagerTasks />} />
						<Route path='/admin/users' element={<ManagerUsers />} />
						<Route path='/admin/create-task' element={<CreateTask />} />
					</Route>

					{/* === USER Routes === */}
					<Route element={<PrivateRoute allowedRoles={['user']} />}>
						<Route path='/user/dashboard' element={<UserDashboard />} />
						<Route path='/user/my-tasks' element={<MyTasks />} />
						<Route path='/user/task-detail/:id' element={<ViewTaskDetails />} />
					</Route>
				</Routes>
			</Router>
		</div>
	)
}

export default App
