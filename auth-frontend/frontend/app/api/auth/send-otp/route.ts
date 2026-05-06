import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import OTP from '@/lib/models/OTP';
import { sendOTP } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.toLowerCase();

    await connectDB();

    // Check if user exists or is super admin
    const user = await User.findOne({ email: normalizedEmail });
    if (!user && normalizedEmail !== superAdminEmail) {
      return NextResponse.json({ error: 'Email not authorized' }, { status: 403 });
    }

    // Invalidate any existing unused OTPs for this email
    await OTP.updateMany(
      { email: normalizedEmail, used: false },
      { $set: { used: true } }
    );

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OTP.create({ email: normalizedEmail, code, expiresAt, used: false });

    // Send email — fall back to console in dev if SMTP fails
    try {
      await sendOTP(normalizedEmail, code);
    } catch (mailErr) {
      if (process.env.NODE_ENV === 'development') {
        console.log('\n============================================');
        console.log(`  DEV MODE — OTP for ${normalizedEmail}: ${code}`);
        console.log('============================================\n');
      } else {
        throw mailErr;
      }
    }

    return NextResponse.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
