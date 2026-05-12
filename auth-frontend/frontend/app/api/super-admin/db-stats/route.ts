import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const db = mongoose.connection.db;
    if (!db) return NextResponse.json({ error: 'No DB connection' }, { status: 500 });

    const stats = await db.command({ dbStats: 1, scale: 1 });

    return NextResponse.json({
      success: true,
      dataSize: stats.dataSize,       // raw data in bytes
      storageSize: stats.storageSize, // allocated on disk in bytes
      indexSize: stats.indexSize,     // index space in bytes
      totalSize: stats.dataSize + stats.indexSize,
      collections: stats.collections,
      objects: stats.objects,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch DB stats' }, { status: 500 });
  }
}
