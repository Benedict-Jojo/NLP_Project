const express = require('express');
const bodyParser = require('body-parser');

// Enable fetch in CommonJS (Node.js v18+)
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3001;

// Middleware to parse incoming JSON
app.use(bodyParser.json());

// API route to talk to Ollama
app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  console.log('📨 Incoming question:', question);

  try {
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt: question,
        stream: false,
      }),
    });

    const text = await response.text();
    console.log('📦 Raw response from Ollama:\n', text);

    let data;
    try {
      data = JSON.parse(text);
      console.log('🤖 LLaMA response:', data.response);
      res.json({ answer: data.response });
    } catch (jsonErr) {
      console.error('❌ Failed to parse Ollama response as JSON.');
      res.status(500).json({ error: 'Invalid JSON from Ollama:\n' + text });
    }
  } catch (err) {
    console.error('❌ Error fetching from Ollama:', err);
    res.status(500).json({
      error: err.message || 'Failed to fetch from Ollama',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
