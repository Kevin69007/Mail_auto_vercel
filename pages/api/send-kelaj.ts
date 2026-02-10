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

  // Normaliser le champ 'to' : convertir un tableau en string si nécessaire
  let toEmail: string;
  if (Array.isArray(to)) {
    toEmail = to.join(', ');
  } else if (typeof to === 'string') {
    toEmail = to;
  } else {
    return res.status(400).json({
      error: 'Champ invalide',
      message: 'Le champ "to" doit être une string ou un tableau de strings',
    });
  }

  // Normaliser les autres champs pour s'assurer qu'ils sont des strings
  const fromEmail = String(from);
  const subjectText = String(subject);
  const messageIdText = String(messageId);
  const bodyText = body ? String(body) : undefined;

  const transporter = nodemailer.createTransport({
    host: process.env.KELAJ_SMTP_HOST,
    port: parseInt(process.env.KELAJ_SMTP_PORT || '465'),
    secure: process.env.KELAJ_SMTP_PORT === '465',
    auth: {
      user: process.env.KELAJ_SMTP_USER,
      pass: process.env.KELAJ_SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${process.env.KELAJ_FROM_NAME}" <${process.env.KELAJ_FROM_EMAIL}>`,
    to: toEmail,
    subject: `Re: ${subjectText}`,
    text: bodyText || 'Merci pour votre message. Nous vous répondrons bientôt.',
    inReplyTo: messageIdText,
    references: messageIdText,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    // Notification interne
    await transporter.sendMail({
      from: `"Notifier - KELAJ" <${process.env.KELAJ_FROM_EMAIL}>`,
      to: 'morganrivelon@gmail.com',
      subject: `[Notification - KELAJ] Email envoyé à ${toEmail}`,
      text: `Un email a été envoyé via le service KELAJ :\n\n` +
            `Destinataire : ${toEmail}\nSujet : ${subjectText}\nMessage ID : ${info.messageId}\n\n` +
            `Contenu :\n${bodyText || 'Aucun contenu.'}`,
    });

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[KELAJ] Erreur SMTP:', error.message);
      return res.status(500).json({ error: 'Erreur SMTP', details: error.message });
    }
    return res.status(500).json({ error: 'Erreur inconnue' });
  }
}
