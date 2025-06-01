import axios from 'axios';

interface EmergencyMessage {
	name: string;
	phone: string;
	situation: string;
}

// Mock Twilio service that logs emergency notifications
export const sendEmergencyNotification = async (data: EmergencyMessage): Promise<boolean> => {
	try {
		// In a real app, this would call the Twilio API
		console.log('EMERGENCY NOTIFICATION:', data);
		
		// Return success for demo purposes
		return true;
	} catch (error) {
		console.error('Failed to send emergency notification:', error);
		return false;
	}
};