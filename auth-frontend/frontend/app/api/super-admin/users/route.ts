import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Portfolio from '@/lib/models/Portfolio';
import Template from '@/lib/models/Template';
import { getSession } from '@/lib/auth';

async function requireSuperAdmin(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const guard = await requireSuperAdmin(req);
  if (guard) return guard;

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const filterActive = searchParams.get('isActive');

  const query: Record<string, unknown> = { role: 'user' };
  if (search) query.email = { $regex: search, $options: 'i' };
  if (filterActive !== null && filterActive !== '') query.isActive = filterActive === 'true';

  const users = await User.find(query).populate('allocatedTemplate', 'name slug category').sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: users });
}

export async function POST(req: NextRequest) {
  const guard = await requireSuperAdmin(req);
  if (guard) return guard;

  await dbConnect();
  const { email, username, templateId } = await req.json();

  if (!email || !username) {
    return NextResponse.json({ success: false, error: 'Email and username required' }, { status: 400 });
  }

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    return NextResponse.json({ success: false, error: 'Email or username already taken' }, { status: 409 });
  }

  const user = await User.create({ email, username, role: 'user', allocatedTemplate: templateId || null, isActive: true });

  if (templateId) {
    const template = await Template.findById(templateId);
    if (template) {
      await Portfolio.create({ user: user._id, template: templateId, content: template.adminConfig?.defaultContent || {}, isPublished: true });
    }
  }

  return NextResponse.json({ success: true, data: user }, { status: 201 });
}
