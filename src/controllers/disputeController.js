import { Booking, Dispute } from '../models/index.js';

async function ensureBookingParticipant(booking, userId) {
  return booking && (booking.customer_id === userId || booking.tailor_id === userId);
}

export async function createDispute(req, res) {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: 'reason required' });
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    const isParticipant = await ensureBookingParticipant(booking, req.user.id);
    if (!isParticipant) return res.status(403).json({ error: 'Not allowed' });
    const dispute = await Dispute.create({ booking_id: bookingId, raised_by_user_id: req.user.id, reason });
    return res.status(201).json(dispute);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function listMyDisputes(req, res) {
  const disputes = await Dispute.findAll({ where: { raised_by_user_id: req.user.id }, order: [['createdAt', 'DESC']] });
  return res.json(disputes);
}

export async function listOpenDisputes(req, res) {
  const disputes = await Dispute.findAll({ where: { status: 'open' }, order: [['createdAt', 'DESC']] });
  return res.json(disputes);
}

export async function resolveDispute(req, res) {
  try {
    const { disputeId } = req.params;
    const { resolution_note } = req.body;
    const dispute = await Dispute.findByPk(disputeId);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
    dispute.status = 'resolved';
    dispute.resolution_note = resolution_note;
    await dispute.save();
    return res.json(dispute);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function rejectDispute(req, res) {
  try {
    const { disputeId } = req.params;
    const { resolution_note } = req.body;
    const dispute = await Dispute.findByPk(disputeId);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
    dispute.status = 'rejected';
    dispute.resolution_note = resolution_note;
    await dispute.save();
    return res.json(dispute);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}