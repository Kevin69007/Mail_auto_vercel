import express from 'express';
import nodemailer from 'nodemailer';
import { authenticateApiKey } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/send-jak
 * Envoie un email via le service JAK
 */
router.post('/', authenticateApiKey, async (req, res) => {
  const { to, from, subject, messageId, body } = req.body;

  // Validation des champs requis
  if (!from || !subject || !messageId) {
    return res.status(400).json({
      error: 'Champs manquants',
      required: ['from', 'subject', 'messageId'],
    });
  }

  // Configuration du transporteur SMTP
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
    text: body || 'Merci pour votre message. Nous vous répondrons bientôt',
    inReplyTo: messageId,
    references: messageId,
  };

  try {
    console.log(`[JAK] Tentative d'envoi d'email à ${to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[JAK] Email envoyé avec succès: ${info.messageId}`);

    // Notification interne
    try {
      await transporter.sendMail({
        from: `"Notifier - JAK" <${process.env.JAK_FROM_EMAIL}>`,
        to: 'asathoud16@gmail.com',
        subject: `[Notification - JAK] Email envoyé à ${to}`,
        text: `Un email a été envoyé via le service JAK :\n\n` +
              `Destinataire : ${to}\nSujet : ${subject}\nMessage ID : ${info.messageId}\n\n` +
              `Contenu :\n${body || 'Aucun contenu.'}`,
      });
    } catch (notifError) {
      console.error('[JAK] Erreur lors de l\'envoi de la notification:', notifError);
      // On continue même si la notification échoue
    }

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[JAK] Erreur SMTP:', error.message);
      console.error('[JAK] Stack trace:', error.stack);
      return res.status(500).json({
        error: 'Erreur SMTP',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
    console.error('[JAK] Erreur inconnue:', error);
    return res.status(500).json({
      error: 'Erreur inconnue',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;

