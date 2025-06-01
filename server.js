import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'dist')));

// API Routes - Forward to the API server or Netlify Functions
app.use('/api', async (req, res) => {
  try {
    // Import the API handlers from src/api/server.js
    const apiModule = await import('./src/api/server.js');
    
    // Get the endpoint name from the path
    const endpoint = req.path.substring(1); // Remove leading slash
    
    // Check if the handler exists
    if (endpoint && typeof apiModule[endpoint] === 'function') {
      // Call the appropriate handler
      apiModule[endpoint](req, res);
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  } catch (error) {
    console.error('API routing error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Main server running on port ${PORT}`);
});