import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Content from '@/lib/models/Content';
import { DEFAULT_USER_CONTENT } from '@/lib/defaultContent';

export async function GET(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session || !session.isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSession(request);
    if (!session || !session.isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { email } = await request.json();
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    const normalized = email.toLowerCase().trim();
    await connectDB();
    const existing = await User.findOne({ email: normalized });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    const user = await User.create({
      email: normalized,
      isSuperAdmin: false,
      permissions: { visibleScreens: [], editableSections: [] },
      createdAt: new Date(),
    });

    // Seed default portfolio content for the new user (idempotent per section).
    await Promise.all(
      DEFAULT_USER_CONTENT.map((item) =>
        Content.updateOne(
          { section: item.section, userEmail: normalized },
          { $setOnInsert: { ...item, userEmail: normalized, updatedAt: new Date() } },
          { upsert: true }
        )
      )
    );

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
