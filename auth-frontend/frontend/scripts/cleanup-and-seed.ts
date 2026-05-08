/**
 * Cleanup script:
 *  - Deletes ALL users
 *  - Deletes ALL portfolios (allocated templates)
 *  - Deletes ALL contents
 *  - Deletes ALL OTPs
 *  - Wipes templates collection and re-seeds maren + mintslate
 *  - Creates ONE superadmin user
 *
 * Run:  TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' \
 *       npx ts-node -r tsconfig-paths/register scripts/cleanup-and-seed.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import marenConfig from '../configs/template-configs/maren';
import mintslateConfig from '../configs/template-configs/mintslate';

const MONGODB_URI = process.env.MONGODB_URI!;
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'prasathru14@gmail.com';

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

// Minimal schemas (matching production models)
const TemplateSchema = new mongoose.Schema({
  name: String, slug: String, category: String, thumbnail: String,
  isPublished: Boolean, pricingType: String, frontendPath: String, adminConfig: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, required: false, unique: true, sparse: true, lowercase: true, trim: true },
  role: { type: String, enum: ['superadmin', 'user'], default: 'user' },
  allocatedTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', default: null },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

const Template = mongoose.models.Template || mongoose.model('Template', TemplateSchema);
const User     = mongoose.models.User     || mongoose.model('User',     UserSchema);

async function run() {
  console.log('Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  const db = mongoose.connection.db!;

  // 1. Wipe data collections (use deleteMany to be safe vs drop on missing collections)
  console.log('Wiping users, portfolios, contents, otps, templates…');
  const cols = await db.listCollections().toArray();
  const colNames = cols.map(c => c.name);
  for (const name of ['users', 'portfolios', 'contents', 'otps', 'templates']) {
    if (colNames.includes(name)) {
      const result = await db.collection(name).deleteMany({});
      console.log(`  ✓ ${name}: deleted ${result.deletedCount}`);
    } else {
      console.log(`  • ${name}: not present`);
    }
  }

  // 2. Re-seed templates
  console.log('\nRe-seeding templates…');
  const marenDoc = await Template.create({
    name: 'Maren', slug: 'maren', category: 'developer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'developer/MarenTemplate',
    adminConfig: { defaultContent: marenConfig.defaultContent },
  });
  console.log(`  ✓ maren     created → ${marenDoc._id}`);

  const mintDoc = await Template.create({
    name: 'Mint Slate', slug: 'mintslate', category: 'developer',
    thumbnail: '', isPublished: true, pricingType: 'free',
    frontendPath: 'developer/MintSlateTemplate',
    adminConfig: { defaultContent: mintslateConfig.defaultContent },
  });
  console.log(`  ✓ mintslate created → ${mintDoc._id}`);

  // 3. Create superadmin
  console.log('\nCreating superadmin…');
  const sa = await User.create({
    email: SUPER_ADMIN_EMAIL,
    role: 'superadmin',
    isActive: true,
    allocatedTemplate: null,
  });
  console.log(`  ✓ superadmin created: ${sa.email}`);

  await mongoose.disconnect();
  console.log('\nAll done.');
}

run().catch(err => {
  console.error('FAILED:', err);
  mongoose.disconnect();
  process.exit(1);
});
