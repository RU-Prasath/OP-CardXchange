// import nodemailer from 'nodemailer';

// export async function sendEmail(to: string, subject: string, html: string) {
//     const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: Number(process.env.SMTP_PORT || 587),
//         secure: false,
//         auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASS
//         }
//     });

//     const info = await transporter.sendMail({
//         from: `"No Reply" <${process.env.SMTP_USER}>`,
//         to,
//         subject,
//         html
//     });

//     return info;
// }

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM || "No Reply <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.error("Resend email error:", error);
    throw new Error("Failed to send email");
  }
}
