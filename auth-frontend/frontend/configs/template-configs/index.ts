import developerConfig from './developer';
import marenConfig from './maren';
import mintslateConfig from './mintslate';
import type { TemplateConfig } from '@/types';

const templateConfigs: Record<string, TemplateConfig> = {
  developer: developerConfig,
  maren: marenConfig,
  mintslate: mintslateConfig,
};

export function getTemplateConfig(slug: string): TemplateConfig | null {
  return templateConfigs[slug] || null;
}

export default templateConfigs;
