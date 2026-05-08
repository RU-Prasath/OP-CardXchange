import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
  await dbConnect();
  const now = new Date();

  const paidUsers = await User.find({ role: 'user', plan: 'paid', isActive: true, planStartDate: { $ne: null } });

  const toDeactivate = paidUsers.filter(u => {
    if (!u.planStartDate) return false;
    const durationDays = u.planBilling === 'yearly' ? 365 : 30;
    const expiry = new Date(u.planStartDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
    return now >= expiry;
  });

  if (toDeactivate.length > 0) {
    await User.updateMany(
      { _id: { $in: toDeactivate.map(u => u._id) } },
      { $set: { isActive: false } }
    );
  }

  return NextResponse.json({ success: true, deactivated: toDeactivate.length });
}
