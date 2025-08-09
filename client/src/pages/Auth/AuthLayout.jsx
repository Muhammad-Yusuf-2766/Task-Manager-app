import UI_IMG from '../../assets/images/auth_backdrop.png'

const AuthLayout = ({ children }) => {
	return (
		<div className='flex'>
			<div className='w-screen h-screen md:w-[60vw] md:px-12 px-4 pt-8 pb-12 '>
				<h2 className='text-lg font-medium text-black lg:w-[70%]'>
					{' '}
					Task Manager
				</h2>
				{children}
			</div>

			<div className='hidden md:flex w-[40vw] h-screen items-center justify-center bg-gradient-to-r from-sky-100 to-blue-300 '>
				<img src={UI_IMG} alt='Auth img' className='w-64 lg:w-[80%]' />
			</div>
		</div>
	)
}

export default AuthLayout
