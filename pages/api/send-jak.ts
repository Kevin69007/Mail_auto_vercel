import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  if (req.headers['x-api-secret'] !== process.env.API_SECRET_KEY) {
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
    host: process.env.JAK_SMTP_HOST,
    port: parseInt(process.env.JAK_SMTP_PORT || '465'),
    secure: process.env.JAK_SMTP_PORT === '465',
    auth: {
      user: process.env.JAK_SMTP_USER,
      pass: process.env.JAK_SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${process.env.JAK_FROM_NAME}" <${process.env.JAK_FROM_EMAIL}>`,
    to,
    subject: `Re: ${subject}`,
    text: body || 'Merci pour votre message. Nous vous répondrons bientôt.',
    inReplyTo: messageId,
    references: messageId,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    // Notification interne
    await transporter.sendMail({
      from: `"Notifier - JAK" <${process.env.JAK_FROM_EMAIL}>`,
      to: 'asathoud16@gmail.com',
      subject: `[Notification - JAK] Email envoyé à ${to}`,
      text: `Un email a été envoyé via le service JAK :\n\n` +
            `Destinataire : ${to}\nSujet : ${subject}\nMessage ID : ${info.messageId}\n\n` +
            `Contenu :\n${body || 'Aucun contenu.'}`,
    });

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[JAK] Erreur SMTP:', error.message);
      return res.status(500).json({ error: 'Erreur SMTP', details: error.message });
    }
    return res.status(500).json({ error: 'Erreur inconnue' });
  }
}
