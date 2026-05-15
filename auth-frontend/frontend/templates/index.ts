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
  'developer/QuartzTemplate': dynamic(() => import('./developer/QuartzTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'developer/NexusTemplate': dynamic(() => import('./developer/NexusTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'developer/HelixTemplate': dynamic(() => import('./developer/HelixTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'designer/AtelierTemplate': dynamic(() => import('./designer/AtelierTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'designer/PrismTemplate': dynamic(() => import('./designer/PrismTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'designer/MosaicTemplate': dynamic(() => import('./designer/MosaicTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'designer/DebutTemplate': dynamic(() => import('./designer/DebutTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'designer/VellumTemplate': dynamic(() => import('./designer/VellumTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'freelancer/SolaceTemplate': dynamic(() => import('./freelancer/SolaceTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'student/CampusTemplate': dynamic(() => import('./student/CampusTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'marketer/PulseTemplate': dynamic(() => import('./marketer/PulseTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'content-creator/LumenTemplate': dynamic(() => import('./content-creator/LumenTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
  'agency/ForgeTemplate': dynamic(() => import('./agency/ForgeTemplate'), { ssr: true }) as ComponentType<TemplateProps>,
};

export function getTemplateComponent(frontendPath: string): ComponentType<TemplateProps> | null {
  return templateRegistry[frontendPath] || null;
}

export default templateRegistry;
