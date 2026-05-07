import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Template from '@/lib/models/Template';
import { getSession } from '@/lib/auth';

async function requireSuperAdmin() {
  const session = await getSession();
  return session?.role === 'superadmin';
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireSuperAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

  await dbConnect();
  const body = await req.json();
  const template = await Template.findByIdAndUpdate(params.id, { $set: body }, { new: true });
  if (!template) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: template });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireSuperAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

  await dbConnect();
  await Template.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
