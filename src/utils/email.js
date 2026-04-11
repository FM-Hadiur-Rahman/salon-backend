import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAppointmentConfirmation({
  to,
  customerName,
  serviceName,
  date,
  time,
}) {
  if (!to) return;

  const subject = "Ihre Terminanfrage wurde erhalten";
  const html = `
    <h2>Hallo ${customerName},</h2>
    <p>vielen Dank für Ihre Anfrage bei <strong>Maison Élégance</strong>.</p>
    <p><strong>Leistung:</strong> ${serviceName}</p>
    <p><strong>Datum:</strong> ${date}</p>
    <p><strong>Uhrzeit:</strong> ${time}</p>
    <p>Wir bestätigen Ihren Termin so schnell wie möglich.</p>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
}
