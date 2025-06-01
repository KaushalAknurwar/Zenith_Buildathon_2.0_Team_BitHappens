export async function handler(event, context) {
  // Mock API response for Netlify Functions
  const path = event.path.replace('/.netlify/functions/api/', '');
  
  if (path === 'generate-image') {
    const body = JSON.parse(event.body || '{}');
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
      body: JSON.stringify({ 
        success: true, 
        imageUrl 
      })
    };
  }
  
  if (path === 'crisis-alert') {
    const body = JSON.parse(event.body || '{}');
    const { username, latitude, longitude } = body;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Crisis alert sent successfully' 
      })
    };
  }
  
  if (path === 'emergency') {
    const body = JSON.parse(event.body || '{}');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  }
  
  if (path === 'sentiment') {
    const body = JSON.parse(event.body || '{}');
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
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "API endpoint" })
  };
}