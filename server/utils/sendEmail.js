import nodemailer from 'nodemailer';

export const isEmailConfigured = () => Boolean(process.env.SMTP_HOST && process.env.MAIL_FROM);

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
  });

const sendEmail = async ({ to, subject, html, text }) => {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[mail:dev-fallback] Email service is not configured. Logging email instead.');
      console.warn(`[mail:dev-fallback] To: ${to}`);
      console.warn(`[mail:dev-fallback] Subject: ${subject}`);

      if (text) {
        console.warn(`[mail:dev-fallback] Text: ${text}`);
      }

      return {
        delivered: false,
        mode: 'console'
      };
    }

    throw new Error('Email service is not configured');
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html
  });

  return {
    delivered: true,
    mode: 'smtp'
  };
};

export default sendEmail;
