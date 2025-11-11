import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
  APP_URL,
} = process.env;

let transporter = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT ? Number(SMTP_PORT) : 587,
    secure: String(SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function sendOrLog(mailOptions) {
  if (transporter) {
    return transporter.sendMail(mailOptions);
  }
  // Fallback to console in development if SMTP not configured
  console.log('Email (mock):', mailOptions);
  return Promise.resolve();
}

export async function sendVerificationEmail(user, token) {
  const verifyUrl = `${APP_URL || 'http://localhost:4000'}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  const subject = 'Verify your email - Tailor Link';
  const text = `Hello ${user.fullname},\n\nPlease verify your email by clicking the link below:\n${verifyUrl}\n\nIf you did not create an account, please ignore this email.`;
  const html = `<p>Hello ${user.fullname},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>If you did not create an account, please ignore this email.</p>`;

  return sendOrLog({
    from: MAIL_FROM || 'Tailor Link <no-reply@tailorlink.local>',
    to: user.email,
    subject,
    text,
    html,
  });
}

export async function sendPasswordResetEmail(user, token) {
  const resetUrl = `${APP_URL || 'http://localhost:4000'}/reset-password?token=${encodeURIComponent(token)}`;
  const subject = 'Reset your password - Tailor Link';
  const text = `Hello ${user.fullname},\n\nUse the link below to reset your password:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`;
  const html = `<p>Hello ${user.fullname},</p><p>Use the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, you can ignore this email.</p>`;

  return sendOrLog({
    from: MAIL_FROM || 'Tailor Link <no-reply@tailorlink.local>',
    to: user.email,
    subject,
    text,
    html,
  });
}

export async function sendDeliveryInitiated({ customer, tailor, booking, tracking }) {
  const subject = `Delivery initiated for booking ${booking.title || booking.id}`;
  const trackingUrl = `${APP_URL || 'http://localhost:4000'}/track/${tracking.tracking_code}`;
  const text = `Delivery initiated. Carrier: ${tracking.carrier || 'N/A'}\nTracking code: ${tracking.tracking_code}\nTrack at: ${trackingUrl}`;
  const html = `<p>Delivery initiated.</p><p><strong>Carrier:</strong> ${tracking.carrier || 'N/A'}</p><p><strong>Tracking code:</strong> ${tracking.tracking_code}</p><p><a href="${trackingUrl}">Track delivery</a></p>`;

  await sendOrLog({ from: MAIL_FROM || 'Tailor Link <no-reply@tailorlink.local>', to: customer.email, subject, text, html });
  await sendOrLog({ from: MAIL_FROM || 'Tailor Link <no-reply@tailorlink.local>', to: tailor.email, subject, text, html });
}

export async function sendDeliveryStatusUpdate({ customer, tailor, booking, tracking }) {
  const subject = `Delivery status updated: ${tracking.status} for ${booking.title || booking.id}`;
  const trackingUrl = `${APP_URL || 'http://localhost:4000'}/track/${tracking.tracking_code}`;
  const text = `Delivery status: ${tracking.status}\nCarrier: ${tracking.carrier || 'N/A'}\nTracking code: ${tracking.tracking_code}\nTrack at: ${trackingUrl}`;
  const html = `<p>Delivery status: <strong>${tracking.status}</strong></p><p><strong>Carrier:</strong> ${tracking.carrier || 'N/A'}</p><p><strong>Tracking code:</strong> ${tracking.tracking_code}</p><p><a href="${trackingUrl}">Track delivery</a></p>`;

  await sendOrLog({ from: MAIL_FROM || 'Tailor Link <no-reply@tailorlink.local>', to: customer.email, subject, text, html });
  await sendOrLog({ from: MAIL_FROM || 'Tailor Link <no-reply@tailorlink.local>', to: tailor.email, subject, text, html });
}