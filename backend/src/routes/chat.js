const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, model = 'gpt-4' } = req.body;

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      id: Date.now().toString(),
      content: aiResponse,
      isAI: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get chat history endpoint
router.get('/history', async (req, res) => {
  // In a real application, this would fetch from a database
  res.json([]);
});

module.exports = router;
