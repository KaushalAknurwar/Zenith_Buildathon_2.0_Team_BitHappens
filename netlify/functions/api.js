import fetch from 'node-fetch';

export async function handler(event, context) {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

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
async function handleCrisisAlert(body) {
  const { username, latitude, longitude } = body;
  
  console.log(`CRISIS ALERT: User ${username} at location ${latitude}, ${longitude}`);
  
  // In a production environment, this would call the Twilio API
  // For now, we'll just return a success response
  
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
async function handleEmergency(body) {
  const { name, phone, situation } = body;
  
  console.log(`EMERGENCY REQUEST: ${name} (${phone}) - ${situation}`);
  
  // In a production environment, this would call the Twilio API
  // For now, we'll just return a success response
  
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

// Handle image generation with Nebius AI
async function handleImageGeneration(body) {
  const { prompt, image_generator_version, negative_prompt } = body;

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

  try {
    // For demonstration purposes, we'll use Pexels images
    // In a production environment, this would call the Nebius AI API
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
  } catch (error) {
    console.error('Error generating image:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Failed to generate image' })
    };
  }
}