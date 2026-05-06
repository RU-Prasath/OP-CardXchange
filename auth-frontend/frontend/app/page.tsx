import type { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import Content from '@/lib/models/Content';
import User from '@/lib/models/User';
import ClientPortfolio from './ClientPortfolio';
import { buildColorVars } from '@/lib/buildColorVars';

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectDB();
    const hero = await Content.findOne({ section: 'hero', userEmail: '' });
    const data = hero?.data as { name?: string; title?: string; subtitle?: string } | undefined;
    const name = data?.name || 'Portfolio';
    const role = data?.title || '';
    return {
      title: role ? `${name} — ${role}` : name,
      description: data?.subtitle || '',
    };
  } catch {
    return { title: 'Portfolio' };
  }
}

async function getAllContent() {
  try {
    await connectDB();
    const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'contact', 'colors'];
    const contents = await Content.find({ section: { $in: sections }, userEmail: '' });

    const data: Record<string, Record<string, unknown>> = {};
    contents.forEach((c) => {
      data[c.section] = c.data as Record<string, unknown>;
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return {};
  }
}

export const revalidate = 0;

export default async function Home() {
  const content = await getAllContent();
  const colorCSS = buildColorVars((content.colors ?? {}) as Parameters<typeof buildColorVars>[0]);

  await connectDB();
  const superAdmin = await User.findOne({ isSuperAdmin: true });
  const createdYear = superAdmin?.createdAt
    ? new Date(superAdmin.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <>
      {colorCSS && (
        <style dangerouslySetInnerHTML={{ __html: colorCSS }} />
      )}
      <ClientPortfolio content={content} createdYear={createdYear} />
    </>
  );
}
