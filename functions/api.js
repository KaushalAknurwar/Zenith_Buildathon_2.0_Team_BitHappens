const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const serverless = require('serverless-http');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Twilio configuration
const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error('Missing required Twilio credentials in environment variables');
}

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
      process.env.EMERGENCY_CONTACT_NUMBER
    ].filter(Boolean);

    if (recipients.length === 0) {
      throw new Error('No emergency contact numbers configured');
    }

    // Send SMS to all recipients
    const smsPromises = recipients.map(to => 
      client.messages.create({
        body: emergencyMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      })
    );
    const smsMessages = await Promise.all(smsPromises);
    console.log('SMS messages sent successfully:', smsMessages.map(msg => msg.sid));

    // Send WhatsApp to all recipients
    const whatsappPromises = recipients.map(to => 
      client.messages.create({
        body: emergencyMessage,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
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
      process.env.EMERGENCY_CONTACT_NUMBER
    ].filter(Boolean);

    if (recipients.length === 0) {
      throw new Error('No emergency contact numbers configured');
    }

    // Send SMS to all recipients
    const smsPromises = recipients.map(to => 
      client.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      })
    );
    const smsMessages = await Promise.all(smsPromises);

    // Send WhatsApp to all recipients
    const whatsappPromises = recipients.map(to => 
      client.messages.create({
        body: messageBody,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
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

exports.handler = serverless(app);