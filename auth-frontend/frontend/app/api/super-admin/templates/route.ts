import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Template from '@/lib/models/Template';
import { getSession } from '@/lib/auth';

async function requireSuperAdmin() {
  const session = await getSession();
  return session?.role === 'superadmin';
}

export async function GET() {
  await dbConnect();
  const templates = await Template.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: templates });
}

export async function POST(req: NextRequest) {
  if (!(await requireSuperAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

  await dbConnect();
  const body = await req.json();
  const { name, slug, category, pricingType, frontendPath, thumbnail } = body;

  if (!name || !slug || !category || !frontendPath) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }

  const template = await Template.create({ name, slug, category, pricingType: pricingType || 'free', frontendPath, thumbnail: thumbnail || '', isPublished: false });
  return NextResponse.json({ success: true, data: template }, { status: 201 });
}
