import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../context/userContext'
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data'

const SideMenu = () => {
	const { user, clearUser } = useContext(UserContext)
	const [sideMenuData, setSideMenuData] = useState([])

	const navigate = useNavigate()

	const handleClick = route => {
		if (route === 'logout') {
			clearUser()
			navigate('/login')
			return
		}

		navigate(route)
	}

	useEffect(() => {
		if (user) {
			setSideMenuData(
				user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
			)
		}

		return () => {}
	}, [user])

	return (
		<div className=''>
			<div className=''>
				<div className=''>
					<img src={user?.profileImageUrl} alt='user image' />
				</div>

				{user?.role === 'admin' && <div className=''>Admin</div>}

				<h5>{user?.name || ''}</h5>
				<p>{user?.email || ''}</p>
			</div>

			{sideMenuData.map((item, index) => (
				<button
					key={index}
					className={`w-full flex items-center gap-4 text-[15px]   py-3 px-6 mb-3 cursor-pointer
				`}
					onClick={() => handleClick(item.path)}
				>
					<item.icon className='' />
					{item.label}
				</button>
			))}
		</div>
	)
}

export default SideMenu
