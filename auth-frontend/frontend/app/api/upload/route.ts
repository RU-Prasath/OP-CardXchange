import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import dbConnect from '@/lib/db';
import Portfolio from '@/lib/models/Portfolio';
import Template from '@/lib/models/Template';

async function getTemplateSlug(userId: string): Promise<string> {
  try {
    await dbConnect();
    const portfolio = await Portfolio.findOne({ user: userId }).populate('template', 'slug');
    return (portfolio?.template as { slug: string } | null)?.slug || 'general';
  } catch {
    return 'general';
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ success: false, error: 'No file' }, { status: 400 });

  // Use template slug from form data if provided, else look up from DB
  const templateSlug = (formData.get('template') as string | null) || await getTemplateSlug(session.userId);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split('.').pop() || 'bin';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', templateSlug);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ success: true, url: `/uploads/${templateSlug}/${filename}` });
}
