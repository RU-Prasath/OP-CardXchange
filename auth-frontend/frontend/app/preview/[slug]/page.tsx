import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Template from '@/lib/models/Template';
import { getTemplateComponent } from '@/templates';
import DraggablePreviewBar from '@/components/preview/DraggablePreviewBar';

interface Props { params: { slug: string }; }

export default async function PreviewPage({ params }: Props) {
  await dbConnect();
  const template = await Template.findOne({ slug: params.slug, isPublished: true });
  if (!template) notFound();

  const TemplateComponent = getTemplateComponent(template.frontendPath);
  if (!TemplateComponent) notFound();

  const defaultContent: Record<string, string> = (template.adminConfig?.defaultContent as Record<string, string>) || {};

  return (
    <div>
      <DraggablePreviewBar templateName={template.name}/>
      <TemplateComponent content={defaultContent} username="preview"/>
    </div>
  );
}
