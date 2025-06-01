import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import http from 'http';
import https from 'https';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'dist')));

// Forward API requests to the API server
app.use('/api', async (req, res) => {
  try {
    // Forward the request to the API server running on port 3002
    const apiUrl = `http://localhost:3002${req.url}`;
    console.log(`Forwarding request to: ${apiUrl}`);
    
    const apiRequest = http.request(
      apiUrl,
      {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...req.headers
        }
      },
      (apiResponse) => {
        res.status(apiResponse.statusCode || 500);
        
        // Copy headers from API response
        Object.keys(apiResponse.headers).forEach(key => {
          res.setHeader(key, apiResponse.headers[key]);
        });
        
        // Pipe the API response to our response
        apiResponse.pipe(res);
      }
    );
    
    // Handle errors
    apiRequest.on('error', (error) => {
      console.error('Error forwarding to API server:', error);
      res.status(500).json({ error: 'Failed to reach API server' });
    });
    
    // Forward the request body
    if (req.body) {
      apiRequest.write(JSON.stringify(req.body));
    }
    
    apiRequest.end();
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Main server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});