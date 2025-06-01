import axios from 'axios';

interface EmergencyMessage {
  name: string;
  phone: string;
  situation: string;
}

// Send emergency notifications using Twilio
export const sendEmergencyNotification = async (data: EmergencyMessage): Promise<boolean> => {
  try {
    // Call the API endpoint that will use Twilio
    const response = await axios.post('/api/emergency', data);
    return response.data.success;
  } catch (error) {
    console.error('Failed to send emergency notification:', error);
    return false;
  }
};