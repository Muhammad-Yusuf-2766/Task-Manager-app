import {
	LuClipboardCheck,
	LuLayoutDashboard,
	LuLogOut,
	LuSquarePlus,
	LuUsers,
} from 'react-icons/lu'

export const SIDE_MENU_DATA = [
	{
		id: '01',
		label: 'Dashboard',
		icon: LuLayoutDashboard,
		path: '/admin/dashboard',
	},
	{
		id: '02',
		label: 'Manage Tasks',
		icon: LuClipboardCheck,
		path: '/admin/tasks',
	},
	{
		id: '03',
		label: 'Create Task',
		icon: LuSquarePlus,
		path: '/admin/create-task',
	},
	{
		id: '04',
		label: 'Team Members',
		icon: LuUsers,
		path: '/admin/users',
	},
	{
		id: '05',
		label: 'Logout',
		icon: LuLogOut,
		path: '/admin/logout',
	},
]

export const SIDE_MENU_USER_DATA = [
	{
		id: '01',
		label: 'Dashboard',
		icon: LuLayoutDashboard,
		path: '/user/dashboard',
	},
	{
		id: '02',
		label: 'My Tasks',
		icon: LuClipboardCheck,
		path: '/user/tasks',
	},
	{
		id: '05',
		label: 'Logout',
		icon: LuLogOut,
		path: '/user/logout',
	},
]

export const PRIORITY_DATA = [
	{ label: 'low', value: 'Low' },
	{ label: 'medium', value: 'Medium' },
	{ label: 'high', value: 'High' },
]

export const STATUS_DATA = [
	{ label: 'pending', value: 'Pending' },
	{ label: 'in-progress', value: 'In-Progress' },
	{ label: 'completed', value: 'Completed' },
]
