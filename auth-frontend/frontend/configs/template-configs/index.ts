import developerConfig from './developer';
import marenConfig from './maren';
import mintslateConfig from './mintslate';
import apexConfig from './apex';
import atelierConfig from './atelier';
import quartzConfig from './quartz';
import nexusConfig from './nexus';
import prismConfig from './prism';
import mosaicConfig from './mosaic';
import debutConfig from './debut';
import type { TemplateConfig } from '@/types';

const templateConfigs: Record<string, TemplateConfig> = {
  developer: developerConfig,
  maren: marenConfig,
  mintslate: mintslateConfig,
  apex: apexConfig,
  atelier: atelierConfig,
  quartz: quartzConfig,
  nexus: nexusConfig,
  prism: prismConfig,
  mosaic: mosaicConfig,
  debut: debutConfig,
};

export function getTemplateConfig(slug: string): TemplateConfig | null {
  return templateConfigs[slug] || null;
}

export default templateConfigs;
