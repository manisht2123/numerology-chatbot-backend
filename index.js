const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Define the chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message parameter is required.' });
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4', // Use 'gpt-3.5-turbo' if you don't have access to GPT-4
      messages: [
        { role: 'system', content: 'You are an intelligent numerology assistant providing basic information and guidance about numerology.' },
        { role: 'user', content: message },
      ],
      temperature: 0.7, // Adjust for creativity
      max_tokens: 500, // Adjust based on required response length
    });

    const reply = response.data.choices[0].message.content.trim();
    res.json({ reply });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// Start the server if not in Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
