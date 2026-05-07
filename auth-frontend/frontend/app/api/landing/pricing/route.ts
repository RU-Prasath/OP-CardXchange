import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PricingPlan from '@/lib/models/PricingPlan';

export async function GET() {
  try {
    await dbConnect();
    const plans = await PricingPlan.find({ isVisible: true }).sort({ order: 1 });
    return NextResponse.json({ success: true, data: plans });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
