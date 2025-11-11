import { DeliveryTracking, Booking, User } from '../models/index.js';
import { sendDeliveryInitiated, sendDeliveryStatusUpdate } from './emailService.js';

function generateTrackingCode() {
  const prefix = 'TLR';
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

export async function initiateDelivery({ bookingId, carrier }) {
  const booking = await Booking.findByPk(bookingId);
  if (!booking) throw new Error('Booking not found');
  const code = generateTrackingCode();
  const tracking = await DeliveryTracking.create({ booking_id: bookingId, tracking_code: code, carrier, status: 'created' });
  const [customer, tailor] = await Promise.all([
    User.findByPk(booking.customer_id),
    User.findByPk(booking.tailor_id),
  ]);
  if (customer && tailor) {
    await sendDeliveryInitiated({ customer, tailor, booking, tracking });
  }
  return tracking;
}

export async function updateDeliveryStatus({ bookingId, status }) {
  const tracking = await DeliveryTracking.findOne({ where: { booking_id: bookingId } });
  if (!tracking) throw new Error('Tracking not found');
  tracking.status = status;
  await tracking.save();
  const booking = await Booking.findByPk(bookingId);
  if (booking) {
    const [customer, tailor] = await Promise.all([
      User.findByPk(booking.customer_id),
      User.findByPk(booking.tailor_id),
    ]);
    if (customer && tailor) {
      await sendDeliveryStatusUpdate({ customer, tailor, booking, tracking });
    }
  }
  return tracking;
}