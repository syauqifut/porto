const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../assets/data/message.json');
const dirPath = path.dirname(filePath);


// ===== Save JSON =====
function saveMessage(data) {
  let existing = [];

  // ensure folder exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (fs.existsSync(filePath)) {
    try {
      existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
      console.error('Error parsing message.json:', err);
      existing = [];
    }
  }

  const newData = {
    ...data,
    createdAt: new Date().toISOString()
  };

  existing.push(newData);

  // atomic write
  const tempPath = filePath + '.tmp';
  fs.writeFileSync(tempPath, JSON.stringify(existing, null, 2));
  fs.renameSync(tempPath, filePath);

  return newData;
}


// ===== Telegram =====
async function sendTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram not configured');
    return;
  }

  try {
    const fetchFn = global.fetch || require('node-fetch');

    await fetchFn(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });
  } catch (err) {
    console.error('Failed to send Telegram:', err);
  }
}


// ===== Main Handler =====
async function handleMessage(data) {
  const { name, email, message } = data;

  if (!name || !email || !message) {
    throw new Error('Missing required fields');
  }

  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }

  saveMessage({ name, email, message });

  const text = [
    `New Message from ${name} <${email}>`,
    `${message}`
  ].join('\n');

  await sendTelegram(text);
}

module.exports = { handleMessage };
