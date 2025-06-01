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

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'dist')));

// API Routes - In production, these will be handled by Netlify Functions
app.use('/api', (req, res, next) => {
  try {
    const apiPath = join(__dirname, 'src', 'api');
    import(join(apiPath, 'server.js'))
      .then(module => {
        // Forward the request to the appropriate handler in the API server
        const path = req.path.substring(1); // Remove leading slash
        if (path && typeof module[path] === 'function') {
          module[path](req, res);
        } else {
          res.status(404).json({ error: 'API endpoint not found' });
        }
      })
      .catch(error => {
        console.error('API route error:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  } catch (error) {
    console.error('API routing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});