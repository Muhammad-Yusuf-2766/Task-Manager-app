import { useRef, useState } from 'react'
import { LuUpload, LuUser } from 'react-icons/lu'

const ProfilePhotoSelector = ({ image, setImage }) => {
	const inputRef = useRef(null)
	const [previewUrl, setPreviewUrl] = useState(null)

	const handleImageChange = e => {
		const file = e.target.files[0]
		if (file) {
			// Update the image state
			setImage(file)

			// Generate a preview URL from the file
			const preview = URL.createObjectURL(file)
			setPreviewUrl(preview)
		}
	}

	const handleRemoveImage = () => {
		setImage(null)
		setPreviewUrl(null)
		if (inputRef.current) {
			inputRef.current.value = ''
		}
	}

	const onChooseFile = () => {
		if (inputRef.current) {
			inputRef.current.click()
		}
	}

	return (
		<div className='flex justify-center mb-6'>
			<input
				type='file'
				accept='image/*'
				ref={inputRef}
				onChange={handleImageChange}
				className='hidden'
			/>

			{!image ? (
				<div className='w-20 h-20 flex items-center justify-center rounded-full bg-blue-100/50 cursor-pointer relative'>
					<LuUser className='text-4xl text-primary' />

					<button
						type='button'
						className='w-8 h-8 flex bg-primary text-white items-center justify-center rounded-full absolute -bottom-1 -right-1 cursor-pointer'
						onClick={onChooseFile}
					>
						<LuUpload />
					</button>
				</div>
			) : (
				<div className='relative'>
					<img
						src={previewUrl || URL.createObjectURL(image)}
						alt='Profile Preview'
						className='w-24 h-24 rounded-full object-cover'
					/>
					<button
						type='button'
						className='w-7 h-7 flex items-center justify-center bg-black/60 text-white rounded-full absolute -top-4 -right-4 cursor-pointer text-lg'
						onClick={handleRemoveImage}
					>
						x{/* <LuTrash /> */}
					</button>
				</div>
			)}
		</div>
	)
}

export default ProfilePhotoSelector
