import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Content from '@/lib/models/Content';
import { sendContactForm } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await connectDB();

    // Get contact section settings from DB
    const contactContent = await Content.findOne({ section: 'contact' });
    const contactData = contactContent?.data as Record<string, string | number> | null;

    const recipientEmail =
      (contactData?.recipientEmail as string) || process.env.SUPER_ADMIN_EMAIL || process.env.SMTP_USER || '';

    await sendContactForm({
      name,
      email,
      subject,
      message,
      recipientEmail,
    });

    return NextResponse.json({
      success: true,
      message:
        (contactData?.successMessage as string) ||
        "Message sent! I'll get back to you within 2 business days.",
    });
  } catch (error) {
    console.error('Contact send error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
