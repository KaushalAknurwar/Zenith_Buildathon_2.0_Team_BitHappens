export async function handler(event, context) {
  // Parse the request body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    body = {};
  }

  // Get the path from the event
  const path = event.path.replace('/.netlify/functions/api', '').replace(/^\/+/, '');

  // Handle different API endpoints
  if (path === 'crisis-alert') {
    return handleCrisisAlert(body);
  } else if (path === 'emergency') {
    return handleEmergency(body);
  } else if (path === 'sentiment') {
    return handleSentiment(body);
  }

  // Default response for unknown endpoints
  return {
    statusCode: 404,
    body: JSON.stringify({ error: "Not found" })
  };
}

// Handle crisis alerts
function handleCrisisAlert(body) {
  const { username, latitude, longitude } = body;
  
  console.log(`CRISIS ALERT: User ${username} at location ${latitude}, ${longitude}`);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true, 
      message: 'Crisis alert sent successfully' 
    })
  };
}

// Handle emergency notifications
function handleEmergency(body) {
  const { name, phone, situation } = body;
  
  console.log(`EMERGENCY REQUEST: ${name} (${phone}) - ${situation}`);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
}

// Handle sentiment analysis
function handleSentiment(body) {
  const { text } = body;

  if (!text) {
    return {
      statusCode: 400,
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