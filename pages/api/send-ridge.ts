import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.warn(`[RIDGE] Méthode ${req.method} non autorisée pour ${req.url}`);
    return res.status(405).json({ 
      error: 'Méthode non autorisée',
      allowed: ['POST'],
      received: req.method 
    });
  }

  if (req.headers['x-api-secret'] !== process.env.API_SECRET_KEY) {
    console.warn(`[RIDGE] Tentative d'accès non autorisée depuis ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
    return res.status(403).json({ error: 'Non autorisé' });
  }

  const { to, from, subject, messageId, body } = req.body;

  if (!from || !subject || !messageId) {
    return res.status(400).json({
      error: 'Champs manquants',
      required: ['from', 'subject', 'messageId'],
    });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.RIDGE_SMTP_HOST,
    port: parseInt(process.env.RIDGE_SMTP_PORT || '465'),
    secure: process.env.RIDGE_SMTP_PORT === '465',
    auth: {
      user: process.env.RIDGE_SMTP_USER,
      pass: process.env.RIDGE_SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${process.env.RIDGE_FROM_NAME}" <${process.env.RIDGE_FROM_EMAIL}>`,
    to,
    subject: `Re: ${subject}`,
    text: body || 'Merci pour votre message. Nous vous répondrons bientôt.',
    inReplyTo: messageId,
    references: messageId,
  };

  try {
    console.log(`[RIDGE] Tentative d'envoi d'email à ${to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[RIDGE] Email envoyé avec succès: ${info.messageId}`);

    // Notification interne
    try {
      await transporter.sendMail({
        from: `"Notifier - RIDGE" <${process.env.RIDGE_FROM_EMAIL}>`,
        to: 'asathoud16@gmail.com',
        subject: `[Notification - RIDGE] Email envoyé à ${to}`,
        text: `Un email a été envoyé via le service RIDGE :\n\n` +
              `Destinataire : ${to}\nSujet : ${subject}\nMessage ID : ${info.messageId}\n\n` +
              `Contenu :\n${body || 'Aucun contenu.'}`,
      });
    } catch (notifError) {
      console.error('[RIDGE] Erreur lors de l\'envoi de la notification:', notifError);
      // On continue même si la notification échoue
    }

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[RIDGE] Erreur SMTP:', error.message);
      console.error('[RIDGE] Stack trace:', error.stack);
      return res.status(500).json({ 
        error: 'Erreur SMTP', 
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
    console.error('[RIDGE] Erreur inconnue:', error);
    return res.status(500).json({ 
      error: 'Erreur inconnue',
      timestamp: new Date().toISOString()
    });
  }
}
