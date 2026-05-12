import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import marenConfig from '../configs/template-configs/maren';
import mintslateConfig from '../configs/template-configs/mintslate';
import apexConfig from '../configs/template-configs/apex';

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

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
