import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Content from '@/lib/models/Content';
import User from '@/lib/models/User';

type Params = { params: { section: string } };

function emailToSlug(email: string): string {
  return email.toLowerCase().replace('@', '-at-').replace(/\./g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const userSlug = request.nextUrl.searchParams.get('user');
    let userEmail = '';

    if (userSlug) {
      const users = await User.find({ isSuperAdmin: false });
      const matched = users.find((u) => emailToSlug(u.email) === userSlug);
      if (matched) userEmail = matched.email;
    }

    let content = await Content.findOne({ section: params.section, userEmail });

    // Fallback to super admin content if user content not found
    if (!content && userEmail !== '') {
      content = await Content.findOne({ section: params.section, userEmail: '' });
    }

    if (!content) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    return NextResponse.json({ data: content.data, section: content.section });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
