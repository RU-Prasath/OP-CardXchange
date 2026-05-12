import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import OTP from '@/lib/models/OTP';
import { generateOTP } from '@/lib/auth';
import { sendOTPEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user && normalizedEmail !== superAdminEmail) {
      return NextResponse.json({ success: false, error: 'No account found. Contact your administrator.' }, { status: 404 });
    }

    if (user && !user.isActive) {
      return NextResponse.json({ success: false, error: 'Your account is inactive. Contact admin.' }, { status: 403 });
    }

    await OTP.updateMany({ email: normalizedEmail, used: false }, { $set: { used: true } });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ email: normalizedEmail, code, expiresAt });

    console.log(`\n[OTP] ${normalizedEmail}: ${code}\n`);

    try {
      await sendOTPEmail(normalizedEmail, code);
    } catch {
      if (process.env.NODE_ENV !== 'development') {
        throw new Error('Email delivery failed');
      }
    }

    return NextResponse.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    console.error('send-otp error:', err);
    return NextResponse.json({ success: false, error: 'Failed to send OTP' }, { status: 500 });
  }
}
