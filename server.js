const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.post('/api/generate-response', (req, res) => {
  const messages = req.body.messages;

  const url = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  };
  const data = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    max_tokens: 200,
    temperature: 0.5,
  };

  axios
    .post(url, data, { headers })
    .then(response => {
      const botResponse = response.data.choices[0].message.content;
      res.json({ botResponse });
    })
    .catch(error => {
      console.error('Error generating response:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});