import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Content from '@/lib/models/Content';
import { getSession } from '@/lib/auth';

type Params = { params: { section: string } };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userEmail = session.isSuperAdmin ? '' : session.email;
    let content = await Content.findOne({ section: params.section, userEmail });

    if (!content) {
      // Initialize from super admin's content as template
      const superContent = await Content.findOne({ section: params.section, userEmail: '' });
      if (superContent) {
        content = await Content.create({
          section: params.section,
          userEmail,
          data: superContent.data,
          updatedAt: new Date(),
        });
      }
    }

    return NextResponse.json({ data: content?.data ?? {}, section: params.section });
  } catch (error) {
    console.error('Admin get content error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canEdit =
      session.isSuperAdmin || session.permissions.editableSections.includes(params.section);

    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden: no edit permission for this section' }, { status: 403 });
    }

    const { data } = await request.json();
    if (!data) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 });
    }

    await connectDB();

    const userEmail = session.isSuperAdmin ? '' : session.email;
    const content = await Content.findOneAndUpdate(
      { section: params.section, userEmail },
      { $set: { data, updatedAt: new Date() } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: content.data, section: content.section });
  } catch (error) {
    console.error('Admin update content error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
