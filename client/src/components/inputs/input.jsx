import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const Input = ({ value, onChange, type, label, placeholder }) => {
	const [showPassword, setShowPassword] = useState(false)
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}
	return (
		<div className=''>
			<label className='text-[13px] font-medium text-slate-800 mb-1'>
				{label}
			</label>

			<div className='input-box'>
				<input
					type={
						type == 'password' ? (showPassword ? 'text' : 'password') : type
					}
					value={value}
					onChange={e => onChange(e)}
					placeholder={placeholder}
					className='w-full bg-transparent outline-none '
				/>

				{type === 'password' && (
					<>
						{showPassword ? (
							<FaRegEye
								onClick={() => togglePasswordVisibility()}
								size={22}
								className='text-primary cursor-pointer'
							/>
						) : (
							<FaRegEyeSlash
								size={22}
								onClick={() => togglePasswordVisibility()}
								className='text-slate-400 cursor-pointer'
							/>
						)}
					</>
				)}
			</div>
		</div>
	)
}

export default Input
