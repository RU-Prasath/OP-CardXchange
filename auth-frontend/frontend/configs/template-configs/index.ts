import developerConfig from './developer';
import marenConfig from './maren';
import mintslateConfig from './mintslate';
import apexConfig from './apex';
import atelierConfig from './atelier';
import quartzConfig from './quartz';
import type { TemplateConfig } from '@/types';

const templateConfigs: Record<string, TemplateConfig> = {
  developer: developerConfig,
  maren: marenConfig,
  mintslate: mintslateConfig,
  apex: apexConfig,
  atelier: atelierConfig,
  quartz: quartzConfig,
};

export function getTemplateConfig(slug: string): TemplateConfig | null {
  return templateConfigs[slug] || null;
}

export default templateConfigs;
