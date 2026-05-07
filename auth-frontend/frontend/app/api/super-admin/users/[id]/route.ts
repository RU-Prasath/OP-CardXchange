import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Portfolio from '@/lib/models/Portfolio';
import Template from '@/lib/models/Template';
import { getSession } from '@/lib/auth';

async function requireSuperAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') return false;
  return true;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireSuperAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

  await dbConnect();
  const body = await req.json();
  const { isActive, templateId } = body;

  const user = await User.findById(params.id);
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

  if (typeof isActive === 'boolean') user.isActive = isActive;

  if (templateId !== undefined) {
    const oldTemplateId = user.allocatedTemplate;
    user.allocatedTemplate = templateId || null;

    if (templateId) {
      const template = await Template.findById(templateId);
      const existing = await Portfolio.findOne({ user: user._id });
      if (existing) {
        existing.template = templateId;
        if (template) existing.content = (template.adminConfig?.defaultContent as Record<string, unknown>) || {};
        await existing.save();
      } else if (template) {
        await Portfolio.create({ user: user._id, template: templateId, content: template.adminConfig?.defaultContent || {}, isPublished: true });
      }
    }
  }

  await user.save();
  return NextResponse.json({ success: true, data: user });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireSuperAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });

  await dbConnect();
  await Portfolio.deleteOne({ user: params.id });
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
