import { User } from '../models/index.js';
import { hashPassword } from '../utils/hash.js';

export async function seedSuperAdmin() {
  const {
    SUPERADMIN_EMAIL,
    SUPERADMIN_PASSWORD,
    SUPERADMIN_PHONE,
    SUPERADMIN_FULLNAME,
  } = process.env;

  if (!SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
    console.warn('Superadmin seed skipped: SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD not set');
    return;
  }

  const existing = await User.findOne({ where: { email: SUPERADMIN_EMAIL.toLowerCase() } });
  if (existing) {
    console.log('Superadmin already exists');
    return;
  }

  const pwHash = await hashPassword(SUPERADMIN_PASSWORD);
  await User.create({
    role: 'admin',
    is_superadmin: true,
    fullname: SUPERADMIN_FULLNAME || 'Super Admin',
    phone: SUPERADMIN_PHONE || '+0000000000',
    email: SUPERADMIN_EMAIL.toLowerCase(),
    password_hash: pwHash,
    is_verified: true,
    status: 'active',
  });
  console.log('Superadmin seeded');
}