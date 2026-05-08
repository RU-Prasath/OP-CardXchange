import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Portfolio from '@/lib/models/Portfolio';
import Template from '@/lib/models/Template';
import SiteSettings from '@/lib/models/SiteSettings';
import { getTemplateComponent } from '@/templates';
import PlanExpiryPopup from '@/components/PlanExpiryPopup';
import type { Metadata } from 'next';

interface Props { params: { username: string }; }

async function getData(username: string) {
  await dbConnect();
  const user = await User.findOne({ username, isActive: true });
  if (!user) return null;

  const portfolio = await Portfolio.findOne({ user: user._id, isPublished: true });
  if (!portfolio) return null;

  const template = await Template.findById(portfolio.template);
  if (!template || !template.isPublished) return null;

  const settings = await SiteSettings.findOne();

  // Compute remaining days for expiry popup
  let remaining: number | null = null;
  if ((user.plan || 'free') === 'paid' && user.planStartDate) {
    const durationDays = user.planBilling === 'yearly' ? 365 : 30;
    const expiry = new Date(user.planStartDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
    remaining = Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  }

  return { user, portfolio, template, remaining, contactPhone: settings?.contactPhone || '' };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getData(params.username);
  if (!data) return { title: 'Portfolio not found' };
  const name = (data.portfolio.content as Record<string, string>).name || params.username;
  const role = (data.portfolio.content as Record<string, string>).role || '';
  return {
    title: role ? `${name} — ${role}` : name,
    description: (data.portfolio.content as Record<string, string>).bio || '',
  };
}

export default async function PortfolioPage({ params }: Props) {
  const data = await getData(params.username);
  if (!data) notFound();

  const TemplateComponent = getTemplateComponent(data.template.frontendPath);
  if (!TemplateComponent) notFound();

  return (
    <>
      {data.remaining !== null && data.remaining <= 3 && data.remaining > 0 && (
        <PlanExpiryPopup remaining={data.remaining} contactPhone={data.contactPhone}/>
      )}
      <TemplateComponent
        content={data.portfolio.content as Record<string, string>}
        username={params.username}
      />
    </>
  );
}
