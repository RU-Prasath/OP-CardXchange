import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';
import User from '@/lib/models/User';
import '@/lib/models/Template';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const portfolio = await Portfolio.findOne({ user: session.userId }).populate('template', 'name slug category frontendPath');
  if (!portfolio) return NextResponse.json({ success: false, error: 'No portfolio found' }, { status: 404 });

  return NextResponse.json({ success: true, data: portfolio });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const { content } = await req.json();

  const portfolio = await Portfolio.findOneAndUpdate(
    { user: session.userId },
    { $set: { content } },
    { new: true }
  );

  if (!portfolio) return NextResponse.json({ success: false, error: 'Portfolio not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: portfolio });
}
