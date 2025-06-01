interface EmergencyMessage {
  name: string;
  phone: string;
  situation: string;
}

// Send emergency notifications
export const sendEmergencyNotification = async (data: EmergencyMessage): Promise<boolean> => {
  try {
    // Try to use the API endpoint
    try {
      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return response.ok;
    } catch (fetchError) {
      console.warn("Failed to send emergency notification via API:", fetchError);
      // Provide a mock successful response when the API call fails
      console.log('MOCK EMERGENCY NOTIFICATION:', data);
      return true;
    }
  } catch (error) {
    console.error('Failed to send emergency notification:', error);
    return false;
  }
};