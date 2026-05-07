import { getSession } from '@/lib/auth';
import EditorShell from '@/components/editor/EditorShell';

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return <EditorShell username={session?.username}>{children}</EditorShell>;
}
