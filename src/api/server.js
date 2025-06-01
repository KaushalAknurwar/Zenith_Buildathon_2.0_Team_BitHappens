import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API server is running' });
});

// Add your API endpoints here
app.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    // Mock sentiment analysis response
    const sentiments = ['positive', 'negative', 'neutral'];
    const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    res.json({ 
      sentiment: randomSentiment,
      confidence: Math.random().toFixed(2)
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}

// For Netlify Functions
export const handler = serverless(app);