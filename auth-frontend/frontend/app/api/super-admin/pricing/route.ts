import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import PricingPlan from '@/lib/models/PricingPlan';

async function guard() {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return false;
  return true;
}

export async function GET() {
  if (!await guard()) return NextResponse.json({ success: false }, { status: 401 });
  await dbConnect();
  const plans = await PricingPlan.find({}).sort({ order: 1 });
  return NextResponse.json({ success: true, data: plans });
}

export async function POST(req: NextRequest) {
  if (!await guard()) return NextResponse.json({ success: false }, { status: 401 });
  await dbConnect();
  const body = await req.json();
  const plan = await PricingPlan.create(body);
  return NextResponse.json({ success: true, data: plan });
}
