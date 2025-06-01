import { Twilio } from 'twilio';
import type { Request, Response } from 'express';

const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error('Missing required Twilio credentials in environment variables');
}

const twilio = new Twilio(accountSid, authToken);

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      twilio.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to!
      })
    );
    const smsMessages = await Promise.all(smsPromises);

    // Send WhatsApp to all recipients
    const whatsappPromises = recipients.map(to => 
      twilio.messages.create({
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
}