import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { handleGeminiGenerate, handleGeminiStream } from './src/server/geminiApi.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// API routes
app.post('/api/gemini/generate', handleGeminiGenerate);
app.post('/api/gemini/stream', handleGeminiStream);

// Serve static assets in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
