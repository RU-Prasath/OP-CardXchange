import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Content from '@/lib/models/Content';
import User from '@/lib/models/User';
import ClientPortfolio from '@/app/ClientPortfolio';
import { buildColorVars } from '@/lib/buildColorVars';

function emailToSlug(email: string): string {
  return email.toLowerCase().replace('@', '-at-').replace(/\./g, '-').replace(/[^a-z0-9-]/g, '');
}

export const revalidate = 0;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectDB();
    const users = await User.find({ isSuperAdmin: false });
    const matched = users.find((u) => emailToSlug(u.email) === params.slug);
    if (!matched) return { title: 'Portfolio' };
    const hero = await Content.findOne({ section: 'hero', userEmail: matched.email });
    const fallback = await Content.findOne({ section: 'hero', userEmail: '' });
    const data = (hero?.data || fallback?.data) as { name?: string; title?: string; subtitle?: string } | undefined;
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

async function getUserContent(userEmail: string) {
  try {
    await connectDB();
    const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'contact', 'colors'];
    const contents = await Content.find({ section: { $in: sections }, userEmail });

    const data: Record<string, Record<string, unknown>> = {};
    contents.forEach((c) => {
      data[c.section] = c.data as Record<string, unknown>;
    });

    // Fallback to super admin content for any missing sections
    const missingSections = sections.filter((s) => !data[s]);
    if (missingSections.length > 0) {
      const fallbacks = await Content.find({ section: { $in: missingSections }, userEmail: '' });
      fallbacks.forEach((c) => {
        data[c.section] = c.data as Record<string, unknown>;
      });
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch user content:', error);
    return {};
  }
}

export default async function PublicPortfolioPage({ params }: Props) {
  await connectDB();

  const users = await User.find({ isSuperAdmin: false });
  const matchedUser = users.find((u) => emailToSlug(u.email) === params.slug);

  if (!matchedUser) {
    notFound();
  }

  const content = await getUserContent(matchedUser.email);
  const colorCSS = buildColorVars((content.colors ?? {}) as Parameters<typeof buildColorVars>[0]);
  const createdYear = matchedUser.createdAt
    ? new Date(matchedUser.createdAt).getFullYear()
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
