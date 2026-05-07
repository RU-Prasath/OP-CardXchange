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
  return sendOTPEmail(email, otp);
}

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"FolioForge" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your FolioForge login code',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#0A0D14;color:#ECEEF3;border-radius:16px;padding:40px;border:1px solid rgba(255,255,255,0.1);">
        <h2 style="font-size:24px;font-weight:700;margin-bottom:8px;">Your login code</h2>
        <p style="color:#A6ACBE;margin-bottom:32px;">Enter this code to sign in. It expires in 5 minutes.</p>
        <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
          <span style="font-family:monospace;font-size:40px;font-weight:700;letter-spacing:12px;color:#fff;">${otp}</span>
        </div>
        <p style="color:#6B7185;font-size:13px;">If you did not request this, ignore this email.</p>
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
