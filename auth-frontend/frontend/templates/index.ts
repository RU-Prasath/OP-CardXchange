import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

interface TemplateProps {
  content: Record<string, string>;
  username: string;
  hideBranding?: boolean;
}

const templateRegistry: Record<string, ComponentType<TemplateProps>> = {
  'developer/MarenTemplate': dynamic(() => import('./developer/MarenTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'developer/MintSlateTemplate': dynamic(() => import('./developer/MintSlateTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'developer/ApexTemplate': dynamic(() => import('./developer/ApexTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
};

export function getTemplateComponent(frontendPath: string): ComponentType<TemplateProps> | null {
  return templateRegistry[frontendPath] || null;
}

export default templateRegistry;
