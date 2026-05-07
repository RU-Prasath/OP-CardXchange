import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';

async function guard() {
  const session = await getSession();
  return session?.role === 'superadmin';
}

export async function GET() {
  if (!await guard()) return NextResponse.json({ success: false }, { status: 401 });
  await dbConnect();
  const items = await Testimonial.find({}).sort({ order: 1 });
  return NextResponse.json({ success: true, data: items });
}

export async function POST(req: NextRequest) {
  if (!await guard()) return NextResponse.json({ success: false }, { status: 401 });
  await dbConnect();
  const body = await req.json();
  const t = await Testimonial.create(body);
  return NextResponse.json({ success: true, data: t });
}
