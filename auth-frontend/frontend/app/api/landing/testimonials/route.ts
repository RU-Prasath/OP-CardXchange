import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';

export async function GET() {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({ isVisible: true }).sort({ order: 1 });
    return NextResponse.json({ success: true, data: testimonials });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
