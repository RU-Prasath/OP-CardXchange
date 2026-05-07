import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { isPublished } = await req.json();
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: session.userId },
      { isPublished },
      { new: true }
    );
    if (!portfolio) return NextResponse.json({ success: false, error: 'Portfolio not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: { isPublished: portfolio.isPublished } });
  } catch (err) {
    console.error('visibility error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}
