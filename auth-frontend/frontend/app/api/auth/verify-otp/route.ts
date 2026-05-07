import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import OTP from '@/lib/models/OTP';
import { signToken, COOKIE_NAME } from '@/lib/auth';

function emailToUsername(email: string): string {
  return email.split('@')[0].toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 30);
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otpDoc = await OTP.findOne({
      email: normalizedEmail,
      code: otp.toString(),
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 401 });
    }

    otpDoc.used = true;
    await otpDoc.save();

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.toLowerCase();
    const isSuperAdmin = normalizedEmail === superAdminEmail;

    let user = await User.findOne({ email: normalizedEmail });

    if (!user && isSuperAdmin) {
      user = await User.create({
        email: normalizedEmail,
        username: 'superadmin',
        role: 'superadmin',
        isActive: true,
      });
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, error: 'Account inactive' }, { status: 403 });
    }

    // Backfill username if missing (users created with old schema)
    if (!user.username) {
      const base = isSuperAdmin ? 'superadmin' : emailToUsername(normalizedEmail);
      // ensure uniqueness
      let candidate = base;
      let counter = 1;
      while (await User.findOne({ username: candidate, _id: { $ne: user._id } })) {
        candidate = `${base}${counter++}`;
      }
      user.username = candidate;
    }

    // Backfill role if old schema used isSuperAdmin boolean
    if (!user.role || (user as unknown as Record<string, unknown>).isSuperAdmin) {
      user.role = isSuperAdmin ? 'superadmin' : 'user';
    }

    user.lastLogin = new Date();
    await user.save();

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      username: user.username,
    });

    const response = NextResponse.json({
      success: true,
      user: { email: user.email, role: user.role, username: user.username },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('verify-otp error:', err);
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
