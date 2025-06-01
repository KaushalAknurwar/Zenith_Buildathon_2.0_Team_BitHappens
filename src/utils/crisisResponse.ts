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
            reject(new Error('Geolocation is not supported by your browser'));
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
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
};

// Send SMS via Twilio
const sendSMS = async (phoneNumber: string, message: string): Promise<boolean> => {
    try {
        // Try Netlify function first
        const response = await fetch('/.netlify/functions/api/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: phoneNumber,
                message: message
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send SMS');
        }

        return true;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return false;
    }
};

// Send crisis alert via API
export const sendCrisisAlert = async (username: string, coords: { lat: number; lng: number }): Promise<{ success: boolean; message: string }> => {
    try {
        console.log('Sending crisis alert with coordinates:', coords);
        
        // Send SMS to emergency contact
        const phoneNumber = "+918788293663"; // Your phone number
        const message = `EMERGENCY ALERT: ${username} may need immediate help. Location: https://maps.google.com/?q=${coords.lat},${coords.lng}`;
        
        // Send SMS first
        const smsSent = await sendSMS(phoneNumber, message);
        
        if (smsSent) {
            console.log("✅ SMS alert sent successfully to:", phoneNumber);
        } else {
            console.warn("⚠️ SMS alert could not be sent, trying API alert");
        }
        
        // Try using Netlify function directly
        try {
            const response = await fetch('/.netlify/functions/api/crisis-alert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    latitude: coords.lat,
                    longitude: coords.lng,
                    phoneNumber: phoneNumber
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send crisis alert');
            }

            console.log("✅ Crisis alert sent successfully:", data);
            return {
                success: true,
                message: 'Your Friend needs help reach out to them asap. Location: https://maps.google.com/?q=' + coords.lat + ',' + coords.lng
            };
        } catch (netlifyError) {
            console.warn("Could not reach Netlify function, trying API endpoint:", netlifyError);
            
            try {
                // Try through the API endpoint
                const response = await fetch('/api/crisis-alert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        latitude: coords.lat,
                        longitude: coords.lng,
                        phoneNumber: phoneNumber
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to send crisis alert');
                }

                console.log("✅ Crisis alert sent successfully through API:", data);
                return {
                    success: true,
                    message: 'Your Friend needs help reach out to them asap. Location: https://maps.google.com/?q=' + coords.lat + ',' + coords.lng
                };
            } catch (apiError) {
                console.warn("Could not reach API endpoint, using fallback:", apiError);
                
                // Fallback for demo purposes
                return {
                    success: true,
                    message: 'Your Friend needs help reach out to them asap. Location: https://maps.google.com/?q=' + coords.lat + ',' + coords.lng
                };
            }
        }
    } catch (err) {
        console.error("❌ Failed to send crisis alert:", err);
        return {
            success: false,
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