import Dashboardlayout from '../../components/layouts/Dashboardlayout'
import useUserAuth from '../../hooks/useUserAuth'

const Dashboard = () => {
	useUserAuth()

	return <Dashboardlayout>Dashboard</Dashboardlayout>
}

export default Dashboard
