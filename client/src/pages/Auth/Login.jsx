import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/inputs/input'
import { validateEmail } from '../../utils/helper'
import AuthLayout from './AuthLayout'

const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)

	const navigete = useNavigate()

	const handleLogin = async e => {
		e.preventDefault()

		if (!validateEmail(email)) {
			setError('Please enter a valid email address.')
			return
		}

		if (!password) {
			setError('Password is required.')
			return
		}
		setError(null)

		// Login API call
	}

	return (
		<AuthLayout>
			<div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
				<h3 className='text-xl font-semibold text-black'>Welcome Back </h3>
				<p className='text-xs text-slate-700 mt-[5px] mb-5'>
					Please enter your details to log in
				</p>

				{/* Form fields */}
				<form onSubmit={handleLogin}>
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

					{error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

					<button type='submit' className='btn-primary'>
						Login
					</button>
					<p className='text-[13px] text-slate-800 mt-3'>
						Don't have an account?{' '}
						<span
							className='text-primary cursor-pointer'
							onClick={() => navigete('/signup')}
						>
							Sign Up
						</span>
					</p>
				</form>
			</div>
		</AuthLayout>
	)
}

export default Login
