import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Template from '@/lib/models/Template';

export async function GET() {
  try {
    await dbConnect();
    const templates = await Template.find({ isPublished: true }).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, data: templates });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
