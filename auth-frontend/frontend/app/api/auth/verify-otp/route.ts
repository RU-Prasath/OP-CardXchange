import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import OTP from '@/lib/models/OTP';
import { signJWT } from '@/lib/auth';

const ALL_SECTIONS = ['hero', 'about', 'projects', 'experience', 'skills', 'colors', 'contact'];

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    // Find OTP
    const otpDoc = await OTP.findOne({
      email: normalizedEmail,
      code: otp.toString(),
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    // Mark OTP as used
    otpDoc.used = true;
    await otpDoc.save();

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.toLowerCase();
    const isSuperAdmin = normalizedEmail === superAdminEmail;

    // Find or create user
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create super admin if it's the super admin email
      user = await User.create({
        email: normalizedEmail,
        isSuperAdmin,
        permissions: {
          visibleScreens: isSuperAdmin ? ALL_SECTIONS : [],
          editableSections: isSuperAdmin ? ALL_SECTIONS : [],
        },
        createdAt: new Date(),
      });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    if (isSuperAdmin && !user.isSuperAdmin) {
      user.isSuperAdmin = true;
      user.permissions.visibleScreens = ALL_SECTIONS;
      user.permissions.editableSections = ALL_SECTIONS;
    }
    await user.save();

    const payload = {
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      permissions: user.permissions,
    };

    const token = signJWT(payload);

    const response = NextResponse.json({
      success: true,
      user: payload,
    });

    response.cookies.set('portfolio_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
