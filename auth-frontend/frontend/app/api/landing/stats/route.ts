import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';
import Template from '@/lib/models/Template';
import SiteSettings from '@/lib/models/SiteSettings';

export async function GET() {
  try {
    await dbConnect();
    const [activePortfolios, templateCount, settings] = await Promise.all([
      Portfolio.countDocuments({ isPublished: true }),
      Template.countDocuments({ isPublished: true }),
      SiteSettings.findOne(),
    ]);
    return NextResponse.json({
      success: true,
      data: {
        activePortfolios,
        templateCount,
        developerCount: settings?.developerCount ?? 10,
        avgLighthouse: settings?.avgLighthouse ?? 75,
      },
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
