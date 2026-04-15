require('dotenv').config();

const express = require('express');
const path = require('path');

const { handleMessage } = require('./scripts/handle-message');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(express.static(path.join(__dirname)));


app.get('/config', (req, res) => {
  res.json({
    LANG: process.env.LANG || 'default',
    MEDIUM_USERNAME: process.env.MEDIUM_USERNAME || ''
  });
});


app.post('/message', async (req, res) => {
  try {
    await handleMessage(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error('Message error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});