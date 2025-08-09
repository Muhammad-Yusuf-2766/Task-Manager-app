import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/inputs/input'
import ProfilePhotoSelector from '../../components/inputs/profilePhotoSelector'
import UserContext from '../../context/userContext'
import { API_PATHS } from '../../utils/apiPathes'
import axiosInstance from '../../utils/axiosInstance'
import { validateEmail } from '../../utils/helper'
import uploadImage from '../../utils/uploadImage'
import AuthLayout from './AuthLayout'

const SignUp = () => {
	const [profilePicture, setProfilePicture] = useState(null)
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [adminInviteToken, setAdminInviteToken] = useState('')
	const [error, setError] = useState(null)

	const { updateUser } = useContext(UserContext)

	const navigate = useNavigate()

	//  Handle sign-up logic
	const handleSignUp = async e => {
		e.preventDefault()

		let profileImageUrl = ''

		if (!name) {
			setError('Please enter your full name.')
			return
		}

		if (!validateEmail(email)) {
			setError('Please enter a valid email address.')
			return
		}

		if (!password) {
			setError('Password is required.')
			return
		}
		setError(null)

		// SignUp API call
		try {
			if (profilePicture) {
				const imgUploadRes = await uploadImage(profilePicture)
				profileImageUrl = imgUploadRes.imageUrl || ''
			}

			const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
				name,
				email,
				password,
				profileImageUrl,
			})

			const { token, user } = response.data
			if (token) {
				localStorage.setItem('token', token)
				updateUser(user)
				navigate('/user/dashboard')
			}
		} catch (error) {
			if (error.response && error.response.data.message) {
				setError(error.response.data.message)
			} else {
				setError('Something went wrong')
			}
		}
	}

	return (
		<AuthLayout>
			<div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
				<h3 className='text-xl font-semibold text-black'>Create an Account</h3>
				<p className='text-xs text-slate-700 mt-[5px] mb-6'>
					Join us today by entering your details below.
				</p>

				{/* Form fields */}
				<form onSubmit={handleSignUp}>
					<ProfilePhotoSelector
						image={profilePicture}
						setImage={setProfilePicture}
					/>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<Input
							value={name}
							onChange={e => setName(e.target.value)}
							type='text'
							label='Full Name'
							placeholder='John Doe'
						/>
						<Input
							value={email}
							onChange={e => setEmail(e.target.value)}
							type='email'
							label='Email Address'
							placeholder='mike@gmail.com'
						/>
						<Input
							value={password}
							onChange={e => setPassword(e.target.value)}
							type='password'
							label='Password'
							placeholder='*********'
						/>
						<Input
							value={adminInviteToken}
							onChange={e => setAdminInviteToken(e.target.value)}
							type='text'
							label='Admin Invite Token'
							placeholder='6 digit code'
						/>
					</div>

					{error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

					<button type='submit' className='btn-primary'>
						Sign Up
					</button>
					<p className='text-[13px] text-slate-800 mt-3'>
						Do you already have an account? {/* Navigate to login page */}
						<Link className='text-primary cursor-pointer' to={'/login'}>
							Login
						</Link>
					</p>
				</form>
			</div>
		</AuthLayout>
	)
}

export default SignUp
