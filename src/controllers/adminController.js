import { TailorProfile, User, Booking, Review, Dispute, EscrowTransaction, KycDocument, PricingPlan } from '../models/index.js';
import fs from 'fs';
import path from 'path';
import { listEscrow as listEscrowSvc, releaseByTransaction, refundByTransaction } from '../services/escrowService.js';

export async function listPendingTailors(req, res) {
  const results = await TailorProfile.findAll({ where: { approval_status: 'pending' }, include: [{ model: User, attributes: ['id', 'fullname', 'email', 'phone'] }] });
  return res.json(results);
}

export async function approveTailor(req, res) {
  const { userId } = req.params;
  const profile = await TailorProfile.findOne({ where: { user_id: userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  profile.approval_status = 'approved';
  await profile.save();
  return res.json({ message: 'Tailor approved' });
}

export async function rejectTailor(req, res) {
  const { userId } = req.params;
  const profile = await TailorProfile.findOne({ where: { user_id: userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  profile.approval_status = 'rejected';
  await profile.save();
  return res.json({ message: 'Tailor rejected' });
}

export async function getAdminStats(req, res) {
  const [totalUsers, customers, tailors, admins, verifiedUsers, suspendedUsers, pendingTailors, reviewsPending, disputesOpen] = await Promise.all([
    User.count(),
    User.count({ where: { role: 'customer' } }),
    User.count({ where: { role: 'tailor' } }),
    User.count({ where: { role: 'admin' } }),
    User.count({ where: { is_verified: true } }),
    User.count({ where: { status: 'suspended' } }),
    TailorProfile.count({ where: { approval_status: 'pending' } }),
    Review.count({ where: { approved_by_admin: false } }),
    Dispute.count({ where: { status: 'open' } }),
  ]);

  const bookingStatuses = ['requested', 'accepted', 'in_progress', 'completed', 'delivered', 'cancelled', 'disputed'];
  const bookingCounts = {};
  for (const st of bookingStatuses) {
    // eslint-disable-next-line no-await-in-loop
    bookingCounts[st] = await Booking.count({ where: { status: st } });
  }

  const escrowStatuses = ['initialized', 'funded', 'released', 'refunded', 'held'];
  const escrow = {};
  for (const st of escrowStatuses) {
    // eslint-disable-next-line no-await-in-loop
    const [count, sum] = await Promise.all([
      EscrowTransaction.count({ where: { status: st } }),
      EscrowTransaction.sum('amount', { where: { status: st } }),
    ]);
    escrow[st] = { count, amount: sum || '0' };
  }

  return res.json({
    users: { total: totalUsers, customers, tailors, admins, verified: verifiedUsers, suspended: suspendedUsers },
    tailors: { pending_approval: pendingTailors },
    bookings: bookingCounts,
    reviews: { pending: reviewsPending },
    disputes: { open: disputesOpen },
    escrow,
  });
}

export async function listUsers(req, res) {
  const { role, status, page = 1, limit = 20 } = req.query;
  const where = {};
  if (role) where.role = role;
  if (status) where.status = status;
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const { rows, count } = await User.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit: pageSize, offset: (pageNum - 1) * pageSize });
  return res.json({ items: rows, total: count, page: pageNum, pageSize, totalPages: Math.ceil(count / pageSize) || 1 });
}

export async function updateUserStatus(req, res) {
  const { userId } = req.params;
  const { status } = req.body; // 'active' | 'suspended'
  if (!['active', 'suspended'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.status = status;
  await user.save();
  return res.json(user);
}

export async function updateUserRole(req, res) {
  const { userId } = req.params;
  const { role } = req.body; // 'customer' | 'tailor' | 'admin'
  if (!['customer', 'tailor', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.role = role;
  await user.save();
  return res.json(user);
}

export async function listEscrow(req, res) {
  const { status, provider, page, limit } = req.query;
  const result = await listEscrowSvc({ status, provider, page, limit });
  return res.json(result);
}

export async function releaseEscrowTx(req, res) {
  try {
    const { txId } = req.params;
    const tx = await releaseByTransaction(txId);
    return res.json(tx);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function refundEscrowTx(req, res) {
  try {
    const { txId } = req.params;
    const tx = await refundByTransaction(txId);
    return res.json(tx);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function getTailorDetail(req, res) {
  const { userId } = req.params;
  const profile = await TailorProfile.findOne({ where: { user_id: userId } });
  if (!profile) return res.status(404).json({ error: 'Tailor profile not found' });
  const user = await User.findByPk(userId, { attributes: ['id', 'fullname', 'email', 'phone', 'role', 'is_verified', 'status', 'createdAt'] });
  const kyc = await KycDocument.findAll({ where: { user_id: userId }, order: [['createdAt', 'DESC']] });
  const plans = await PricingPlan.findAll({ where: { user_id: userId }, order: [['createdAt', 'DESC']] });
  return res.json({ user, profile, kyc, plans });
}

export async function downloadKycDoc(req, res) {
  try {
    const { userId, docId } = req.params;
    const doc = await KycDocument.findByPk(docId);
    if (!doc || doc.user_id !== userId) return res.status(404).json({ error: 'Document not found' });
    const filePath = path.resolve(doc.file_path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing' });
    res.setHeader('Content-Type', doc.mime_type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.original_name || path.basename(filePath)}"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}