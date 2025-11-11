import { Message, Booking } from '../models/index.js';

export async function sendMessageHandler(req, res) {
  try {
    const { bookingId } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    // Ensure sender is part of booking
    if (![booking.customer_id, booking.tailor_id].includes(req.user.id)) return res.status(403).json({ error: 'Not part of booking' });
    const msg = await Message.create({ booking_id: bookingId, sender_id: req.user.id, content });
    return res.status(201).json(msg);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function listMessagesHandler(req, res) {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (![booking.customer_id, booking.tailor_id].includes(req.user.id)) return res.status(403).json({ error: 'Not part of booking' });
    const msgs = await Message.findAll({ where: { booking_id: bookingId }, order: [['created_at', 'ASC']] });
    return res.json(msgs);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}