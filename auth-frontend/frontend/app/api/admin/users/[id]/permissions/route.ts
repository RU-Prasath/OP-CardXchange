import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

type Params = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = getSession(request);

    if (!session || !session.isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { visibleScreens, editableSections } = await request.json();

    if (!Array.isArray(visibleScreens) || !Array.isArray(editableSections)) {
      return NextResponse.json({ error: 'Invalid permissions format' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      params.id,
      {
        $set: {
          'permissions.visibleScreens': visibleScreens,
          'permissions.editableSections': editableSections,
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Update permissions error:', error);
    return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = getSession(request);
    if (!session || !session.isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await connectDB();
    const user = await User.findById(params.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.isSuperAdmin) return NextResponse.json({ error: 'Cannot remove super admin' }, { status: 403 });
    await User.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
