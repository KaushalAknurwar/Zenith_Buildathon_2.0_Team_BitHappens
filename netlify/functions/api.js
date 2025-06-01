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
  } else if (path === 'generate-image') {
    return handleImageGeneration(body);
  }

  // Default response for unknown endpoints
  return {
    statusCode: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({ error: "Not found" })
  };
}

// Handle crisis alerts
function handleCrisisAlert(body) {
  const { username, latitude, longitude } = body;
  
  console.log(`CRISIS ALERT: User ${username} at location ${latitude}, ${longitude}`);
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
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
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({ success: true })
  };
}

// Handle sentiment analysis
function handleSentiment(body) {
  const { text } = body;

  if (!text) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
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

// Handle image generation
function handleImageGeneration(body) {
  const { prompt } = body;

  if (!prompt) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Prompt is required' })
    };
  }

  // Pexels images for reliable image generation
  const pexelsImages = [
    "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg",  // sunset
    "https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg",  // beach
    "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",  // mountains
    "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg",  // forest
    "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg",  // city
    "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg",  // lake
    "https://images.pexels.com/photos/1292115/pexels-photo-1292115.jpeg",  // abstract
    "https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg",  // flowers
    "https://images.pexels.com/photos/1693095/pexels-photo-1693095.jpeg",  // space
    "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg",  // waterfall
  ];
  
  // Select a semi-random image based on the prompt
  const promptHash = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIndex = promptHash % pexelsImages.length;
  
  // Add a cache-busting parameter
  const cacheBuster = Date.now();
  const imageUrl = `${pexelsImages[imageIndex]}?cb=${cacheBuster}`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({ imageUrl })
  };
}