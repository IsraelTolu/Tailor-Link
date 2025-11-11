import { createBooking, updateBookingStatus, fundEscrow, releaseEscrow } from '../services/bookingService.js';
import { Booking } from '../models/index.js';

export async function createBookingHandler(req, res) {
  try {
    const { tailorId, title, notes, amount, currency, scheduleDate, provider } = req.body;
    const booking = await createBooking({
      customerId: req.user.id,
      tailorId,
      title,
      notes,
      amount,
      currency,
      scheduleDate,
      providerName: provider,
    });
    return res.status(201).json(booking);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function updateBookingStatusHandler(req, res) {
  try {
    const { bookingId } = req.params;
    const { newStatus } = req.body;
    const booking = await updateBookingStatus({ bookingId, actorRole: req.user.role, newStatus });
    return res.json(booking);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function fundEscrowHandler(req, res) {
  try {
    const { bookingId } = req.params;
    const { reference } = req.body;
    const escrow = await fundEscrow({ bookingId, reference });
    return res.json(escrow);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function releaseEscrowHandler(req, res) {
  try {
    const { bookingId } = req.params;
    const escrow = await releaseEscrow({ bookingId });
    return res.json(escrow);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function listMyBookingsHandler(req, res) {
  try {
    const { status, from, to, page = 1, limit = 20 } = req.query;
    const where = {};
    if (req.user.role === 'customer') where.customer_id = req.user.id;
    else if (req.user.role === 'tailor') where.tailor_id = req.user.id;
    else return res.status(403).json({ error: 'Forbidden' });

    if (status) where.status = status;
    const createdAt = {};
    if (from) createdAt['$gte'] = new Date(from);
    if (to) createdAt['$lte'] = new Date(to);
    if (Object.keys(createdAt).length) where.createdAt = createdAt;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const { rows, count } = await Booking.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit: pageSize, offset: (pageNum - 1) * pageSize });
    return res.json({ items: rows, total: count, page: pageNum, pageSize, totalPages: Math.ceil(count / pageSize) || 1 });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}