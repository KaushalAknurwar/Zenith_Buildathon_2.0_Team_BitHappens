import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error('Missing required Twilio credentials in environment variables');
}

const client = twilio(accountSid, authToken);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, latitude, longitude } = req.body;

    if (!username || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const emergencyMessage = `Your Friend needs help reach out to them asap. Location: https://maps.google.com/?q=${latitude},${longitude}`;

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
        to: to!
      })
    );
    const smsMessages = await Promise.all(smsPromises);

    // Send WhatsApp to all recipients
    const whatsappPromises = recipients.map(to => 
      client.messages.create({
        body: emergencyMessage,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${to}`
      })
    );
    const whatsappMessages = await Promise.all(whatsappPromises);

    return res.status(200).json({ 
      message: 'Crisis alerts sent successfully',
      smsMessageIds: smsMessages.map(msg => msg.sid),
      whatsappMessageIds: whatsappMessages.map(msg => msg.sid)
    });
  } catch (error) {
    console.error('Failed to send crisis alerts:', error);
    return res.status(500).json({ message: 'Failed to send crisis alerts' });
  }
}