import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is missing');
    }

    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text provided' });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `
Analyze the following transcribed text and provide:
1. A concise 2-3 sentence summary
2. 3-5 key insights
3. 3-5 actionable items

Return valid JSON:
{
  "summary": "...",
  "insights": ["..."],
  "actionItems": ["..."]
}

Text:
${text}
`;

    const completion = await groq.chat.completions.create({
  model: 'llama-3.1-8b-instant',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.7,
});


    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content.match(/\{[\s\S]*\}/)[0]);

    res.json({
      success: true,
      data: {
        summary: parsed.summary,
        insights: parsed.insights,
        actionItems: parsed.actionItems.map((item, i) => ({
          id: `action-${i + 1}`,
          text: item,
          completed: false,
        })),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
