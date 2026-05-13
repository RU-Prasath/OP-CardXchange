import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';
import '@/lib/models/Template';
import { getTemplateConfig } from '@/configs/template-configs';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  await dbConnect();
  const portfolio = await Portfolio.findOne({ user: session.userId }).populate('template', 'slug');
  if (!portfolio) return NextResponse.json({ success: false, error: 'No portfolio' }, { status: 404 });

  const slug = (portfolio.template as { slug: string }).slug;
  const config = getTemplateConfig(slug);
  if (!config) return NextResponse.json({ success: false, error: 'Config not found' }, { status: 404 });

  return NextResponse.json({ success: true, data: { slug, sections: config.sections, defaultContent: config.defaultContent } });
}
