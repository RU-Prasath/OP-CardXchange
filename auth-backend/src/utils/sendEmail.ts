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

// import { Resend } from "resend";
// import dotenv from "dotenv";

// dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);
// console.log(process.env.RESEND_API_KEY)
// export async function sendEmail(to: string, subject: string, html: string) {
//   try {
//     const response = await resend.emails.send({
//       from: process.env.RESEND_FROM || "No Reply <onboarding@resend.dev>",
//       to,
//       subject,
//       html,
//     });

//     return response;
//   } catch (error) {
//     console.error("Resend email error:", error);
//     throw new Error("Failed to send email");
//   }
// }


import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
console.log(process.env.RESEND_API_KEY)

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    console.log(`Attempting to send email to: ${to}`);
    
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM || "Your App <onboarding@resend.dev>",
      to: [to], // Ensure it's an array
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}:`, response);
    return response;
  } catch (error: any) {
    console.error("Resend email error details:", {
      to,
      error: error.message,
      response: error.response?.data,
      statusCode: error.statusCode,
    });
    
    // Check for specific Resend errors
    if (error.message?.includes("Invalid 'to' address")) {
      throw new Error("Invalid email address");
    }
    
    throw new Error("Failed to send email. Please try again later.");
  }
}