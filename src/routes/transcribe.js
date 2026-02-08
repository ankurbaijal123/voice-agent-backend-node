import express from 'express';
import multer from 'multer';
import OpenAI from 'openai';

const router = express.Router();
const upload = multer();

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is missing');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const audioFile = new File(
      [req.file.buffer],
      'audio.webm',
      { type: 'audio/webm' }
    );

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });

    res.json({ text: transcription.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
