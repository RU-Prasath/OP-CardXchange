import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ authenticated: false });

  await dbConnect();
  const user = await User.findById(session.userId).select('plan planBilling planStartDate');
  return NextResponse.json({
    authenticated: true,
    role: session.role,
    username: session.username,
    plan: user?.plan || 'free',
    planBilling: user?.planBilling || 'monthly',
    planStartDate: user?.planStartDate || null,
  });
}
