export async function handler(event, context) {
  // Parse the request path and method
  const path = event.path.replace('/.netlify/functions/api/', '');
  const method = event.httpMethod;
  
  // Parse the request body if it exists
  let body = {};
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch (error) {
      console.error('Error parsing request body:', error);
    }
  }
  
  console.log(`API Request: ${method} ${path}`, body);
  
  // Handle different API endpoints
  if (path === 'generate-image') {
    const { prompt } = body;
    
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }
    
    // Return a placeholder image URL based on the prompt
    const imageUrl = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(prompt)}`;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        imageUrl 
      })
    };
  }
  
  if (path === 'crisis-alert') {
    const { username, latitude, longitude, phoneNumber } = body;
    
    // Log the crisis alert (in a real app, this would send notifications)
    console.log(`CRISIS ALERT: User ${username} at location ${latitude}, ${longitude}`);
    
    // If phone number is provided, send SMS
    if (phoneNumber) {
      await sendSMS(phoneNumber, `EMERGENCY ALERT: ${username} may need immediate help. Location: https://maps.google.com/?q=${latitude},${longitude}`);
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Crisis alert sent successfully' 
      })
    };
  }
  
  if (path === 'send-sms') {
    const { to, message } = body;
    
    if (!to || !message) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Phone number and message are required' })
      };
    }
    
    try {
      // In a real app, this would use Twilio SDK
      // For now, we'll just log the message
      console.log(`SENDING SMS TO ${to}: ${message}`);
      
      // Simulate Twilio API call
      const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID || 'AC_your_account_sid';
      const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN || 'your_auth_token';
      const fromNumber = process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER || '+1234567890';
      
      console.log(`Twilio credentials: ${accountSid.substring(0, 5)}... / ${authToken.substring(0, 5)}...`);
      console.log(`From: ${fromNumber}, To: ${to}, Message: ${message}`);
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: true,
          message: 'SMS sent successfully (simulated)'
        })
      };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false,
          error: 'Failed to send SMS'
        })
      };
    }
  }
  
  if (path === 'emergency') {
    const { name, phone, situation } = body;
    
    // Log the emergency request (in a real app, this would use Twilio)
    console.log(`EMERGENCY REQUEST: ${name} (${phone}) - ${situation}`);
    
    // Send SMS to the emergency contact
    if (phone) {
      await sendSMS("+918788293663", `EMERGENCY REQUEST from ${name} (${phone}): ${situation}`);
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true })
    };
  }
  
  if (path === 'sentiment') {
    const { text } = body;
    
    if (!text) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Text is required' })
      };
    }
    
    // Simple mock sentiment analysis
    const sentiments = ['happy', 'sad', 'angry', 'neutral', 'excited'];
    const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    // Map the sentiment to mood emojis
    const emotionToMood = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😡',
      'neutral': '😌',
      'excited': '🥳'
    };
    
    const mood = emotionToMood[randomSentiment];
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        mood,
        emotions: [
          {
            label: randomSentiment,
            score: 0.8
          }
        ]
      })
    };
  }
  
  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }
  
  // Default response for unhandled endpoints
  return {
    statusCode: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ error: 'API endpoint not found' })
  };
}

// Helper function to send SMS (simulated)
async function sendSMS(to, message) {
  // In a real app, this would use Twilio SDK
  console.log(`SENDING SMS TO ${to}: ${message}`);
  
  // Log the attempt
  console.log(`SMS would be sent to ${to} with message: ${message}`);
  
  // Return success for demo purposes
  return true;
}