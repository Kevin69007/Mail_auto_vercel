import nodemailer from 'nodemailer';

export async function sendEmail({
  prefix,
  to,
  from,
  subject,
  messageId,
  body,
}: {
  prefix: string;
  to: string;
  from: string;
  subject: string;
  messageId: string;
  body?: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env[`${prefix}_SMTP_HOST`]!,
    port: parseInt(process.env[`${prefix}_SMTP_PORT`]!),
    secure: process.env[`${prefix}_SMTP_PORT`] === '465',
    auth: {
      user: process.env[`${prefix}_SMTP_USER`]!,
      pass: process.env[`${prefix}_SMTP_PASSWORD`]!,
    },
  });

  const mailOptions = {
    from: `"${process.env[`${prefix}_FROM_NAME`]}" <${process.env[`${prefix}_FROM_EMAIL`]}>`,
    to,
    subject: `Re: ${subject}`,
    text: body || 'Merci pour votre message. Nous vous répondrons bientôt.',
    inReplyTo: messageId,
    references: messageId,
  };

  const info = await transporter.sendMail(mailOptions);

  // Notification interne
  const notificationMail = {
    from: `"Notifier - ${prefix}" <${process.env[`${prefix}_FROM_EMAIL`]}>`,
    to: 'asathoud16@gmail.com',
    subject: `[Notification - ${prefix}] Email envoyé à ${to}`,
    text: `Un email a été envoyé via le service ${prefix} :\n\n` +
          `Destinataire : ${to}\n` +
          `Sujet : ${subject}\n` +
          `Message ID : ${info.messageId}\n\n` +
          `Contenu :\n${body || 'Aucun contenu.'}`,
  };

  await transporter.sendMail(notificationMail);

  return info.messageId;
}
