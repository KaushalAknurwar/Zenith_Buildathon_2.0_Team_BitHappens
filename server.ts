import express from 'express';
import type { Request, Response, Router, RequestHandler } from 'express';
import cors from 'cors';
import twilio from 'twilio';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const router: Router = express.Router();
const port = process.env.PORT || 3002;

// Hugging Face setup
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Twilio configuration
const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID || 'AC0b077a09883015f99d299d3f6b6ec088';
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN || 'c62b2c41ffedc0cc5ae1cc2740219846';
const client = twilio(accountSid, authToken);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Sentiment analysis endpoint
app.post('/sentiment', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await hf.textClassification({
      model: 'SamLowe/roberta-base-go_emotions',
      inputs: text,
    });

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
    const topEmotion = result[0].label;
    const mood = emotionToMood[topEmotion] || '😌';

    res.json({
      mood,
      emotions: result.map(r => ({
        label: r.label,
        score: r.score
      }))
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

// Crisis alert endpoint
const crisisAlertHandler: RequestHandler = async (req, res) => {
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
      '+918788293663'
    ];

    // Send SMS to all recipients
    const smsPromises = recipients.map(to => 
      client.messages.create({
        body: emergencyMessage,
        from: '+17753681889',
        to
      })
    );
    const smsMessages = await Promise.all(smsPromises);
    console.log('SMS messages sent successfully:', smsMessages.map(msg => msg.sid));

    // Send WhatsApp to all recipients
    const whatsappPromises = recipients.map(to => 
      client.messages.create({
        body: emergencyMessage,
        from: 'whatsapp:+14155238886',
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
};

router.post('/crisis-alert', crisisAlertHandler);

// Emergency endpoint
router.post('/emergency', async (req, res) => {
  const { name, phone, situation } = req.body;

  try {
    const messageBody = `Your Friend needs help reach out to them asap. Details:\nName: ${name}\nPhone: ${phone}\nSituation: ${situation}`;

    // Recipient numbers
    const recipients = [
      '+918788293663'
    ];

    // Send SMS to all recipients
    const smsPromises = recipients.map(to => 
      client.messages.create({
        body: messageBody,
        from: '+17753681889',
        to
      })
    );
    const smsMessages = await Promise.all(smsPromises);

    // Send WhatsApp to all recipients
    const whatsappPromises = recipients.map(to => 
      client.messages.create({
        body: messageBody,
        from: 'whatsapp:+14155238886',
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
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Mount router
app.use('/api', router);

// Only start the server if we're not in a Netlify function environment
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Twilio configuration:', {
      accountSid: accountSid.substring(0, 5) + '...',
      fromNumber: '+17753681889',
      toNumber: '+918788293663'
    });
  });

  // Handle server shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
}

// Export the app for serverless functions
export default app;