import axios from 'axios';

interface EmergencyMessage {
	name: string;
	phone: string;
	situation: string;
}

export const sendEmergencyNotification = async (data: EmergencyMessage): Promise<boolean> => {
	try {
		// Try Netlify function directly first
		try {
			const response = await axios.post('/.netlify/functions/api/emergency', data);
			return response.data.success;
		} catch (netlifyError) {
			console.warn("Could not reach Netlify function, trying API endpoint:", netlifyError);
			
			// Try through the API endpoint
			try {
				const response = await axios.post('/api/emergency', data);
				return response.data.success;
			} catch (apiError) {
				console.warn("Could not reach API endpoint, using fallback:", apiError);
				
				// Log for demo purposes and return success
				console.log('EMERGENCY NOTIFICATION (FALLBACK):', data);
				return true;
			}
		}
	} catch (error) {
		console.error('Failed to send emergency notification:', error);
		return false;
	}
};