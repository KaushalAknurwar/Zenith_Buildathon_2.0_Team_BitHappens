const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const serverless = require('serverless-http');

// Twilio configuration
const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID || 'YOUR_SID';
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN || 'YOUR_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Crisis alert endpoint
app.post('/crisis-alert', async (req, res) => {
  try {
    const { username, latitude, longitude } = req.body;
    console.log('Received crisis alert request:', { username, latitude, longitude });

    if (!username || !latitude || !longitude) {
      console.error('Missing required fields:', { username, latitude, longitude });
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const emergencyMessage = `Your Friend needs help reach out to them asap. Location: https://maps.google.com/?q=${latitude},${longitude}`;
    console.log('Sending emergency messages:', emergencyMessage);

    // Recipient numbers
    const recipients = [
      'YPUR_NUMBER'
    ];

    // Send SMS to all recipients
    const smsPromises = recipients.map(to => 
      client.messages.create({
        body: emergencyMessage,
        from: 'YOUR_TWILLIO_NUMBER',
        to
      })
    );
    const smsMessages = await Promise.all(smsPromises);
    console.log('SMS messages sent successfully:', smsMessages.map(msg => msg.sid));

    // Send WhatsApp to all recipients
    const whatsappPromises = recipients.map(to => 
      client.messages.create({
        body: emergencyMessage,
        from: 'whatsapp:+YOUR_TWILLIO_WHATSAPP_NUMBER',
        to: `whatsapp:${to}`
      })
    );
    const whatsappMessages = await Promise.all(whatsappPromises);
    console.log('WhatsApp messages sent successfully:', whatsappMessages.map(msg => msg.sid));

    res.status(200).json({ 
      message: 'Crisis alerts sent successfully',
      smsMessageIds: smsMessages.map(msg => msg.sid),
      whatsappMessageIds: whatsappMessages.map(msg => msg.sid)
    });
  } catch (error) {
    console.error('Failed to send crisis alerts:', error);
    res.status(500).json({ 
      message: 'Failed to send crisis alerts',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Emergency endpoint
app.post('/emergency', async (req, res) => {
  const { name, phone, situation } = req.body;

  try {
    const messageBody = `Your Friend needs help reach out to them asap. Details:\nName: ${name}\nPhone: ${phone}\nSituation: ${situation}`;

    // Recipient numbers
    const recipients = [
      'YOUR_NUMBER'
    ];

    // Send SMS to all recipients
    const smsPromises = recipients.map(to => 
      client.messages.create({
        body: messageBody,
        from: 'YOUR_TWILLIO_NUMBER',
        to
      })
    );
    const smsMessages = await Promise.all(smsPromises);

    // Send WhatsApp to all recipients
    const whatsappPromises = recipients.map(to => 
      client.messages.create({
        body: messageBody,
        from: 'whatsapp:YOUR_TWILLIO_WHATSAPP',
        to: `whatsapp:${to}`
      })
    );
    const whatsappMessages = await Promise.all(whatsappPromises);

    return res.status(200).json({ 
      success: true, 
      smsMessageIds: smsMessages.map(msg => msg.sid),
      whatsappMessageIds: whatsappMessages.map(msg => msg.sid)
    });
  } catch (error) {
    console.error('Twilio error:', error);
    return res.status(500).json({ error: 'Failed to send emergency notifications' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Sentiment analysis endpoint
app.post('/sentiment', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Mock sentiment analysis response since we can't use HuggingFace in Netlify Functions
    const emotions = [
      { label: 'joy', score: 0.8 },
      { label: 'neutral', score: 0.1 },
      { label: 'surprise', score: 0.05 },
      { label: 'sadness', score: 0.03 },
      { label: 'anger', score: 0.02 }
    ];

    // Map the emotion labels to mood emojis
    const emotionToMood = {
      'joy': '😊',
      'sadness': '😢',
      'anger': '😡',
      'fear': '😰',
      'surprise': '🤔',
      'neutral': '😌',
      'excitement': '🥳',
      'tiredness': '😴'
    };

    // Get the top emotion
    const topEmotion = emotions[0].label;
    const mood = emotionToMood[topEmotion] || '😌';

    res.json({
      mood,
      emotions: emotions
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

module.exports.handler = serverless(app);
