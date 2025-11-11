import jwt from 'jsonwebtoken';
import { sequelize, User, VerificationToken, PasswordResetToken } from '../models/index.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken, ttlHoursToDate } from '../utils/token.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService.js';

const { JWT_SECRET = 'dev_secret', JWT_EXPIRES_IN = '1h', EMAIL_VERIFICATION_TTL_HOURS = '48', PASSWORD_RESET_TTL_HOURS = '1' } = process.env;

function signJWT(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function register({ role, fullname, phone, email, password }) {
  if (!['customer', 'tailor', 'admin'].includes(role)) {
    throw new Error('Invalid role');
  }

  const pwHash = await hashPassword(password);

  const user = await sequelize.transaction(async (t) => {
    const created = await User.create(
      { role, fullname, phone, email: email.toLowerCase(), password_hash: pwHash },
      { transaction: t }
    );

    const token = generateToken(24);
    await VerificationToken.create(
      {
        user_id: created.id,
        token,
        expires_at: ttlHoursToDate(Number(EMAIL_VERIFICATION_TTL_HOURS) || 48),
      },
      { transaction: t }
    );

    // Send email (outside transaction)
    await sendVerificationEmail(created, token);

    return created;
  });

  return { id: user.id, email: user.email, phone: user.phone, role: user.role };
}

export async function verifyEmail(token) {
  const vt = await VerificationToken.findOne({ where: { token } });
  if (!vt || vt.consumed || vt.expires_at < new Date()) {
    throw new Error('Invalid or expired token');
  }
  const user = await User.findByPk(vt.user_id);
  if (!user) throw new Error('User not found');

  user.is_verified = true;
  await user.save();
  vt.consumed = true;
  await vt.save();

  return { message: 'Email verified' };
}

export async function login({ identifier, password }) {
  const where = identifier.includes('@') ? { email: identifier.toLowerCase() } : { phone: identifier };
  const user = await User.findOne({ where });
  if (!user) throw new Error('Invalid credentials');
  const ok = await comparePassword(password, user.password_hash);
  if (!ok) throw new Error('Invalid credentials');
  if (user.status !== 'active') throw new Error('Account suspended');
  if (!user.is_verified) throw new Error('Email not verified');

  const token = signJWT(user);
  return { token, user: { id: user.id, role: user.role, fullname: user.fullname, email: user.email, phone: user.phone } };
}

export async function forgotPassword({ email }) {
  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!user) return { message: 'If the email exists, a reset link was sent' };

  const token = generateToken(24);
  await PasswordResetToken.create({
    user_id: user.id,
    token,
    expires_at: ttlHoursToDate(Number(PASSWORD_RESET_TTL_HOURS) || 1),
  });

  await sendPasswordResetEmail(user, token);
  return { message: 'If the email exists, a reset link was sent' };
}

export async function resetPassword({ token, newPassword }) {
  const prt = await PasswordResetToken.findOne({ where: { token } });
  if (!prt || prt.consumed || prt.expires_at < new Date()) {
    throw new Error('Invalid or expired token');
  }
  const user = await User.findByPk(prt.user_id);
  if (!user) throw new Error('User not found');
  user.password_hash = await hashPassword(newPassword);
  await user.save();
  prt.consumed = true;
  await prt.save();
  return { message: 'Password updated' };
}