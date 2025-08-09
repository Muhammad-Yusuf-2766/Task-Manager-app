import { API_PATHS } from './apiPathes'
import axiosInstance from './axiosInstance'

const uploadImage = async imageFile => {
	const formData = new FormData()

	// Append image to form data
	formData.append('image', imageFile)

	// API CALL
	try {
		const response = await axiosInstance.post(
			API_PATHS.IMAGE.UPLOAD_IMAGE,
			formData,
			{
				headers: { 'Content-Type': 'multipart/form-data' }, // Set header for file upload
			}
		)

		return response.data
	} catch (error) {
		console.error('Error uploding the image', error)
		throw error // Rethrow error for error handling
	}
}

export default uploadImage
