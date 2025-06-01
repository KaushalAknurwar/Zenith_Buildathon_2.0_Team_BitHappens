import axios from 'axios';
export const sendEmergencyNotification = async (data) => {
    try {
        const response = await axios.post('/api/emergency', data);
        return response.data.success;
    }
    catch (error) {
        console.error('Failed to send emergency notification:', error);
        return false;
    }
};
