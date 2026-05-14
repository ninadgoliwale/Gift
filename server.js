const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7700811288:AAF-NuID48VeO0c8bRDNTjLxtESoLWIjC2U';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8558052873';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/send-order', async (req, res) => {
  try {
    const { userEmail, telegramId, amount, cartItems, userName } = req.body;
    
    let message = `📦 *NEW GIFT CARD ORDER*\n\n`;
    message += `👤 *Customer:* ${userName}\n`;
    message += `📧 *Email:* ${userEmail}\n`;
    message += `💬 *Telegram:* ${telegramId || 'Not provided'}\n`;
    message += `💰 *Amount:* ₹${amount}\n\n`;
    message += `🛒 *Items:*\n`;
    
    cartItems.forEach(item => {
      message += `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}\n`;
    });
    
    message += `\n⏰ *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
    message += `\n✅ *Action:* Send gift card to customer's email & telegram\n`;
    message += `💳 *UPI:* ninadxclerk@fam`;

    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    await axios.post(telegramURL, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });

    res.json({ success: true, message: 'Order sent to Telegram' });
    
  } catch (error) {
    console.error('Telegram send error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to send order' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ GiftCard Marketplace running on port ${PORT}`);
  console.log(`📱 Telegram bot connected to chat: ${TELEGRAM_CHAT_ID}`);
});
