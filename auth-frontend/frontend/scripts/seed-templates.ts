import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import marenConfig from '../configs/template-configs/maren';
import mintslateConfig from '../configs/template-configs/mintslate';
import apexConfig from '../configs/template-configs/apex';
import atelierConfig from '../configs/template-configs/atelier';
import quartzConfig from '../configs/template-configs/quartz';
import nexusConfig from '../configs/template-configs/nexus';
import prismConfig from '../configs/template-configs/prism';
import mosaicConfig from '../configs/template-configs/mosaic';
import debutConfig from '../configs/template-configs/debut';
import helixConfig from '../configs/template-configs/helix';
import vellumConfig from '../configs/template-configs/vellum';
import solaceConfig from '../configs/template-configs/solace';
import campusConfig from '../configs/template-configs/campus';
import pulseConfig from '../configs/template-configs/pulse';
import lumenConfig from '../configs/template-configs/lumen';
import forgeConfig from '../configs/template-configs/forge';

const MONGODB_URI = process.env.MONGODB_URI!;

const TemplateSchema = new mongoose.Schema({
  name: String, slug: String, category: String, thumbnail: String,
  isPublished: Boolean, pricingType: String, frontendPath: String, adminConfig: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Template = mongoose.models.Template || mongoose.model('Template', TemplateSchema);

async function upsert(slug: string, data: object) {
  const existing = await Template.findOne({ slug });
  if (existing) {
    await Template.findOneAndUpdate({ slug }, data);
    console.log(`✓ ${slug} updated`);
  } else {
    await Template.create(data);
    console.log(`✓ ${slug} created`);
  }
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await upsert('maren', {
    name: 'Maren', slug: 'maren', category: 'developer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'developer/MarenTemplate',
    adminConfig: { defaultContent: marenConfig.defaultContent },
  });

  await upsert('mintslate', {
    name: 'Mint Slate', slug: 'mintslate', category: 'developer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'developer/MintSlateTemplate',
    adminConfig: { defaultContent: mintslateConfig.defaultContent },
  });

  await upsert('apex', {
    name: 'Apex', slug: 'apex', category: 'developer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'developer/ApexTemplate',
    adminConfig: { defaultContent: apexConfig.defaultContent },
  });

  await upsert('atelier', {
    name: 'Atelier', slug: 'atelier', category: 'designer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'designer/AtelierTemplate',
    adminConfig: { defaultContent: atelierConfig.defaultContent },
  });

  await upsert('quartz', {
    name: 'Quartz', slug: 'quartz', category: 'developer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'developer/QuartzTemplate',
    adminConfig: { defaultContent: quartzConfig.defaultContent },
  });

  await upsert('nexus', {
    name: 'Nexus', slug: 'nexus', category: 'developer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'developer/NexusTemplate',
    adminConfig: { defaultContent: nexusConfig.defaultContent },
  });

  await upsert('prism', {
    name: 'Prism', slug: 'prism', category: 'designer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'designer/PrismTemplate',
    adminConfig: { defaultContent: prismConfig.defaultContent },
  });

  await upsert('mosaic', {
    name: 'Mosaic', slug: 'mosaic', category: 'designer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'designer/MosaicTemplate',
    adminConfig: { defaultContent: mosaicConfig.defaultContent },
  });

  await upsert('debut', {
    name: 'Debut', slug: 'debut', category: 'designer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'designer/DebutTemplate',
    adminConfig: { defaultContent: debutConfig.defaultContent },
  });

  // ── New templates (May 2026) ──
  await upsert('helix', {
    name: 'Helix', slug: 'helix', category: 'developer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'developer/HelixTemplate',
    adminConfig: { defaultContent: helixConfig.defaultContent },
  });

  await upsert('vellum', {
    name: 'Vellum', slug: 'vellum', category: 'designer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'designer/VellumTemplate',
    adminConfig: { defaultContent: vellumConfig.defaultContent },
  });

  await upsert('solace', {
    name: 'Solace', slug: 'solace', category: 'freelancer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'freelancer/SolaceTemplate',
    adminConfig: { defaultContent: solaceConfig.defaultContent },
  });

  await upsert('campus', {
    name: 'Campus', slug: 'campus', category: 'student',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'student/CampusTemplate',
    adminConfig: { defaultContent: campusConfig.defaultContent },
  });

  await upsert('pulse', {
    name: 'Pulse', slug: 'pulse', category: 'marketer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'marketer/PulseTemplate',
    adminConfig: { defaultContent: pulseConfig.defaultContent },
  });

  await upsert('lumen', {
    name: 'Lumen', slug: 'lumen', category: 'content-creator',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'content-creator/LumenTemplate',
    adminConfig: { defaultContent: lumenConfig.defaultContent },
  });

  await upsert('forge', {
    name: 'Forge', slug: 'forge', category: 'agency',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'agency/ForgeTemplate',
    adminConfig: { defaultContent: forgeConfig.defaultContent },
  });

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
