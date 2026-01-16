import express from 'express';
import nodemailer from 'nodemailer';
import { authenticateApiKey } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/send-ridge
 * Retourne une erreur car cette route nécessite POST
 */
router.get('/', (req, res) => {
  return res.status(405).json({
    error: 'Méthode non autorisée',
    message: 'Cette route nécessite une requête POST',
    allowed: ['POST'],
    received: 'GET'
  });
});

/**
 * POST /api/send-ridge
 * Envoie un email via le service RIDGE
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
});

export default router;

