import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Simple sentiment analysis endpoint
export const sentiment = (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
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

    res.json({
      mood,
      emotions: [
        {
          label: randomSentiment,
          score: 0.8
        }
      ]
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
};

// Crisis alert endpoint
export const crisisAlert = (req, res) => {
  try {
    const { username, latitude, longitude } = req.body;
    
    // Log the alert (in a real app, this would send notifications)
    console.log(`CRISIS ALERT: User ${username} at location ${latitude}, ${longitude}`);
    
    res.json({ 
      success: true, 
      message: 'Crisis alert sent successfully' 
    });
  } catch (error) {
    console.error('Crisis alert error:', error);
    res.status(500).json({ error: 'Failed to send crisis alert' });
  }
};

// Emergency notification endpoint
export const emergency = (req, res) => {
  try {
    const { name, phone, situation } = req.body;
    
    // Log the emergency request (in a real app, this would use Twilio)
    console.log(`EMERGENCY REQUEST: ${name} (${phone}) - ${situation}`);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Emergency notification error:', error);
    res.status(500).json({ error: 'Failed to send emergency notification' });
  }
};

// Image generation endpoint
export const generateImage = (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Return a placeholder image URL based on the prompt
    const imageUrl = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(prompt)}`;
    
    res.json({ 
      success: true, 
      imageUrl 
    });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
};

// Only start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  app.post('/sentiment', sentiment);
  app.post('/crisis-alert', crisisAlert);
  app.post('/emergency', emergency);
  app.post('/generate-image', generateImage);

  // Health check endpoint
  app.get('/', (req, res) => {
    res.json({ status: 'API server is running' });
  });

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}