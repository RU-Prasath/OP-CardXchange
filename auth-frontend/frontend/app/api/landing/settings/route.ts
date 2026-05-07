import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SiteSettings from '@/lib/models/SiteSettings';

export async function GET() {
  try {
    await dbConnect();
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    return NextResponse.json({
      success: true,
      data: {
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
      },
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
