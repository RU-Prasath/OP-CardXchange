import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendOTP(email: string, otp: string): Promise<void> {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${process.env.SMTP_NAME || 'Portfolio Admin'}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Portfolio Admin OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: #0f172a; color: #f1f5f9; border-radius: 8px;">
        <h2 style="color: #10b981; margin-bottom: 16px;">Portfolio Admin Access</h2>
        <p style="margin-bottom: 16px;">Your one-time password (OTP) for admin login:</p>
        <div style="background: #1e293b; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #10b981;">${otp}</span>
        </div>
        <p style="color: #94a3b8; font-size: 14px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  recipientEmail: string;
}

export async function sendContactForm(data: ContactFormData): Promise<void> {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${process.env.SMTP_NAME || 'Portfolio Contact'}" <${process.env.SMTP_USER}>`,
    to: data.recipientEmail,
    replyTo: data.email,
    subject: `Portfolio Contact: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10b981;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #64748b; width: 120px;">Name:</td>
            <td style="padding: 8px;">${data.name}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 8px; font-weight: bold; color: #64748b;">Email:</td>
            <td style="padding: 8px;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #64748b;">Subject:</td>
            <td style="padding: 8px;">${data.subject}</td>
          </tr>
        </table>
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981;">
          <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>
    `,
  });
}
