import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import transcribeRoute from './routes/transcribe.js';
import analyzeRoute from './routes/analyze.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/transcribe', transcribeRoute);
app.use('/analyze', analyzeRoute);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Backend running on http://localhost:${process.env.PORT || 3001}`);
});
