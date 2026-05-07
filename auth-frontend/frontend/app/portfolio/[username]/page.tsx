import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Portfolio from '@/lib/models/Portfolio';
import Template from '@/lib/models/Template';
import { getTemplateComponent } from '@/templates';
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

  return { user, portfolio, template };
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
    <TemplateComponent
      content={data.portfolio.content as Record<string, string>}
      username={params.username}
    />
  );
}
