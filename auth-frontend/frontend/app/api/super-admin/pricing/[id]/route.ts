import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import PricingPlan from '@/lib/models/PricingPlan';

async function guard() {
  const session = await getSession();
  return session?.role === 'superadmin';
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await guard()) return NextResponse.json({ success: false }, { status: 401 });
  await dbConnect();
  const body = await req.json();
  const plan = await PricingPlan.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json({ success: true, data: plan });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!await guard()) return NextResponse.json({ success: false }, { status: 401 });
  await dbConnect();
  await PricingPlan.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
