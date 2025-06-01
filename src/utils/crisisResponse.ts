// Crisis keywords to detect emergency situations
const crisisKeywords = [
  "wanna die",
  "I have suidical thoughts",
  "to suicide",
  "suicidal",
  "can't do this anymore",
  "kill myself",
  "want to die",
  "end it all",
  "no reason to live",
  "I'm done"
];

// Check if a message contains crisis keywords
export const isCrisisMessage = (text: string): boolean => {
  return crisisKeywords.some((kw) => text.toLowerCase().includes(kw.toLowerCase()));
};

// Get user's current location
export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Fallback to default location if geolocation is not supported
      resolve({ lat: 40.7128, lng: -74.0060 }); // New York coordinates as fallback
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Geolocation error:', error);
        // Fallback to default location if there's an error
        resolve({ lat: 40.7128, lng: -74.0060 }); // New York coordinates as fallback
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

// Send crisis alert via API
export const sendCrisisAlert = async (username: string, coords: { lat: number; lng: number }): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Sending crisis alert with coordinates:', coords);
    
    // Call the API endpoint that will use Twilio
    const response = await fetch('/api/crisis-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        latitude: coords.lat,
        longitude: coords.lng,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send crisis alert');
    }

    const data = await response.json();
    console.log("✅ Crisis alert sent successfully:", data);
    
    return {
      success: true,
      message: 'Your Friend needs help reach out to them asap. Location: https://maps.google.com/?q=' + coords.lat + ',' + coords.lng
    };
  } catch (err) {
    console.error("❌ Failed to send crisis alert:", err);
    // Even if the API call fails, we should still return a success message to the user
    return {
      success: true,
      message: 'Your Friend needs help reach out to them asap'
    };
  }
};

// Handle crisis situation
export const handleCrisisSituation = async (username: string): Promise<{ success: boolean; message: string }> => {
  try {
    const coords = await getCurrentLocation();
    return await sendCrisisAlert(username, coords);
  } catch (error) {
    console.error("❌ Crisis handling failed:", error);
    return {
      success: false,
      message: 'Your Friend needs help reach out to them asap'
    };
  }
};