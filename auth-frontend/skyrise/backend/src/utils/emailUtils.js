const createTransporter = require("../config/email");

const emailTemplate = (title, content) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { margin: 0; padding: 0; background: #050505; font-family: 'Inter', sans-serif; }
  .wrapper { max-width: 600px; margin: 0 auto; background: #0F172A; }
  .header { background: linear-gradient(135deg, #0F172A 0%, #1a2744 100%); padding: 40px 32px; text-align: center; border-bottom: 2px solid #D4AF37; }
  .logo-text { color: #D4AF37; font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; }
  .logo-sub { color: #C0C0C0; font-size: 11px; letter-spacing: 4px; margin-top: 4px; }
  .body { padding: 40px 32px; }
  .title { color: #D4AF37; font-size: 20px; font-weight: 600; margin-bottom: 24px; }
  .field { margin-bottom: 16px; }
  .label { color: #C0C0C0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
  .value { color: #FFFFFF; font-size: 15px; padding: 10px 16px; background: rgba(212,175,55,0.08); border-left: 3px solid #D4AF37; border-radius: 2px; }
  .footer { background: #050505; padding: 24px 32px; text-align: center; color: #666; font-size: 12px; }
  .gold { color: #D4AF37; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="logo-text">SKYRISE</div>
    <div class="logo-sub">BUILD & INTERIORS</div>
  </div>
  <div class="body">
    <div class="title">${title}</div>
    ${content}
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} <span class="gold">Skyrise Build & Interiors</span>. All rights reserved.</p>
    <p>This is an automated notification from your website.</p>
  </div>
</div>
</body>
</html>`;

const fieldHtml = (label, value) => `
<div class="field">
  <div class="label">${label}</div>
  <div class="value">${value || "—"}</div>
</div>`;

const sendContactNotification = async (data) => {
  const transporter = createTransporter();
  const content = `
    ${fieldHtml("Name", data.name)}
    ${fieldHtml("Email", data.email)}
    ${fieldHtml("Phone", data.phone)}
    ${fieldHtml("Message", data.message)}
    ${fieldHtml("Submitted At", new Date().toLocaleString("en-IN"))}
  `;
  await transporter.sendMail({
    from: `"Skyrise Website" <${process.env.SMTP_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `📩 New Contact Enquiry — ${data.name}`,
    html: emailTemplate("New Contact Enquiry Received", content),
  });
};

const sendLeadNotification = async (data) => {
  const transporter = createTransporter();
  const content = `
    ${fieldHtml("Name", data.name)}
    ${fieldHtml("Email", data.email)}
    ${fieldHtml("Phone", data.phone)}
    ${fieldHtml("Source", "Website Popup")}
    ${fieldHtml("Submitted At", new Date().toLocaleString("en-IN"))}
  `;
  await transporter.sendMail({
    from: `"Skyrise Website" <${process.env.SMTP_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🎯 New Lead Captured — ${data.name}`,
    html: emailTemplate("New Lead from Website Popup", content),
  });
};

const sendAutoReply = async (data, type = "contact") => {
  const transporter = createTransporter();
  const greeting = type === "contact" ? "Thank you for your enquiry" : "Thank you for your interest";
  const content = `
    <p style="color:#FFFFFF;line-height:1.8;">Dear <strong style="color:#D4AF37;">${data.name}</strong>,</p>
    <p style="color:#C0C0C0;line-height:1.8;">${greeting}. We have received your details and our team will get back to you shortly.</p>
    <p style="color:#C0C0C0;line-height:1.8;">For immediate assistance, please contact us via WhatsApp or call us directly.</p>
    <br/>
    <p style="color:#D4AF37;font-weight:600;">Skyrise Build & Interiors Team</p>
  `;
  await transporter.sendMail({
    from: `"Skyrise Build & Interiors" <${process.env.SMTP_FROM}>`,
    to: data.email,
    subject: "We received your enquiry — Skyrise Build & Interiors",
    html: emailTemplate("Thank You for Reaching Out", content),
  });
};

module.exports = { sendContactNotification, sendLeadNotification, sendAutoReply };
