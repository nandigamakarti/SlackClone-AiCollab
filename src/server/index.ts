import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Import sentiment analysis functions
import { analyzeSentiment as analyzeApiSentiment, handleOptions } from './api/sentimentAnalysis';
import { getNotes, generateNotes } from './api/aiNotes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/api/sentiment', (req: Request, res: Response) => analyzeApiSentiment(req, res));
app.options('/api/sentiment', (req: Request, res: Response) => handleOptions(req, res));

// AI Notes routes
app.get('/api/notes/:channelId', (req: Request, res: Response) => getNotes(req, res));
app.post('/api/generate-notes/:channelId', (req: Request, res: Response) => generateNotes(req, res));

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app; 