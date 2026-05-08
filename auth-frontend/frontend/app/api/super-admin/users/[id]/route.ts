import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Portfolio from '@/lib/models/Portfolio';
import Template from '@/lib/models/Template';
import Content from '@/lib/models/Content';
import OTP from '@/lib/models/OTP';
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
  const { isActive, templateId, phone, pricingPlanId, paidAmount, planBilling } = body;

  const user = await User.findById(params.id);
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

  if (typeof isActive === 'boolean') user.isActive = isActive;
  if (typeof phone === 'string') user.phone = phone;
  if (typeof paidAmount === 'number') user.paidAmount = paidAmount;
  if (planBilling === 'monthly' || planBilling === 'yearly') user.planBilling = planBilling;

  if (pricingPlanId !== undefined) {
    if (pricingPlanId) {
      const PricingPlan = (await import('@/lib/models/PricingPlan')).default;
      const pp = await PricingPlan.findById(pricingPlanId);
      if (pp) {
        user.pricingPlanId = pricingPlanId;
        // Derive plan type and billing from the pricing plan
        user.plan = pp.monthlyPrice === 0 && pp.yearlyPrice === 0 ? 'free' : 'paid';
        // Keep existing billing cycle, just update the plan ref
      }
    } else {
      user.pricingPlanId = null;
      user.plan = 'free';
    }
  }

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
  const user = await User.findById(params.id);
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

  await Promise.all([
    Portfolio.deleteOne({ user: params.id }),
    Content.deleteMany({ userEmail: user.email }),
    OTP.deleteMany({ email: user.email }),
    User.findByIdAndDelete(params.id),
  ]);

  return NextResponse.json({ success: true });
}
