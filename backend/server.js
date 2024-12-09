const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
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
app.get('/api/chat/history', async (req, res) => {
  // In a real application, this would fetch from a database
  res.json([]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
