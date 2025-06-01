import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

// Simple sentiment analysis endpoint
app.post('/sentiment', (req, res) => {
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
});

// Crisis alert endpoint
app.post('/crisis-alert', (req, res) => {
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
});

// Emergency notification endpoint
app.post('/emergency', (req, res) => {
  try {
    const { name, phone, situation } = req.body;
    
    // Log the emergency request (in a real app, this would use Twilio)
    console.log(`EMERGENCY REQUEST: ${name} (${phone}) - ${situation}`);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Emergency notification error:', error);
    res.status(500).json({ error: 'Failed to send emergency notification' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});