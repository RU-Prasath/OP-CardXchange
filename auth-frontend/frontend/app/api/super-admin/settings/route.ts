import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SiteSettings from '@/lib/models/SiteSettings';

async function guard() {
  const session = await getSession();
  return session?.role === 'superadmin';
}

export async function GET() {
  if (!await guard()) return NextResponse.json({ success: false }, { status: 401 });
  await dbConnect();
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  return NextResponse.json({ success: true, data: settings });
}

export async function PATCH(req: NextRequest) {
  if (!await guard()) return NextResponse.json({ success: false }, { status: 401 });
  await dbConnect();
  const body = await req.json();
  const settings = await SiteSettings.findOneAndUpdate({}, body, { new: true, upsert: true });
  return NextResponse.json({ success: true, data: settings });
}
