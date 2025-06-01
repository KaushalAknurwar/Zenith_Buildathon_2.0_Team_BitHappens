import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Sentiment analysis endpoint
app.post('/sentiment', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await hf.textClassification({
      model: 'SamLowe/roberta-base-go_emotions',
      inputs: text,
    });

    // Map the emotion labels to mood emojis
    const emotionToMood = {
      'joy': '😊',
      'sadness': '😢',
      'anger': '😡',
      'fear': '😰',
      'surprise': '🤔',
      'neutral': '😌',
      'excitement': '🥳',
      'tiredness': '😴'
    };

    // Get the top emotion
    const topEmotion = result[0].label;
    const mood = emotionToMood[topEmotion] || '😌';

    res.json({
      mood,
      emotions: result.map(r => ({
        label: r.label,
        score: r.score
      }))
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

// Emergency alert endpoint
app.post('/emergency', async (req, res) => {
  try {
    const { name, phone, situation } = req.body;
    
    // In a real app, this would send a message via Twilio
    console.log(`Emergency alert from ${name} (${phone}): ${situation}`);
    
    res.json({ success: true, message: 'Emergency notification sent' });
  } catch (error) {
    console.error('Emergency notification error:', error);
    res.status(500).json({ success: false, error: 'Failed to send emergency notification' });
  }
});

// Crisis alert endpoint
app.post('/crisis-alert', async (req, res) => {
  try {
    const { username, latitude, longitude } = req.body;
    
    // In a real app, this would send alerts to emergency contacts
    console.log(`Crisis alert from ${username} at location: ${latitude}, ${longitude}`);
    
    res.json({ success: true, message: 'Crisis alert sent' });
  } catch (error) {
    console.error('Crisis alert error:', error);
    res.status(500).json({ success: false, error: 'Failed to send crisis alert' });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

export const handler = serverless(app);