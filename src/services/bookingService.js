import { sequelize, Booking, EscrowTransaction, User } from '../models/index.js';
import { FlutterwaveProvider } from '../payments/flutterwave.js';
import { PagaProvider } from '../payments/paga.js';

function getProvider(name) {
  if (name === 'flutterwave') return new FlutterwaveProvider();
  if (name === 'paga') return new PagaProvider();
  throw new Error('Unknown provider');
}

export async function createBooking({ customerId, tailorId, title, notes, amount, currency = 'NGN', scheduleDate, providerName }) {
  const provider = getProvider(providerName);
  const booking = await sequelize.transaction(async (t) => {
    const b = await Booking.create({
      customer_id: customerId,
      tailor_id: tailorId,
      price_amount: amount,
      currency,
      title,
      notes,
      schedule_date: scheduleDate,
    }, { transaction: t });

    const customer = await User.findByPk(customerId);
    const init = await provider.initializeEscrow({ amount, currency, customer, booking: b });

    await EscrowTransaction.create({
      booking_id: b.id,
      provider: providerName,
      reference: init.reference,
      amount,
      currency,
      status: 'initialized',
      metadata: init,
    }, { transaction: t });

    return b;
  });

  return booking;
}

export async function updateBookingStatus({ bookingId, actorRole, newStatus }) {
  const booking = await Booking.findByPk(bookingId);
  if (!booking) throw new Error('Booking not found');
  // basic rules
  const allowed = {
    requested: ['accepted', 'cancelled'],
    accepted: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'disputed'],
    completed: ['delivered', 'disputed'],
  };
  const next = allowed[booking.status] || [];
  if (!next.includes(newStatus)) throw new Error('Invalid status transition');
  booking.status = newStatus;
  await booking.save();
  return booking;
}

export async function fundEscrow({ bookingId, reference }) {
  const escrow = await EscrowTransaction.findOne({ where: { booking_id: bookingId, reference } });
  if (!escrow) throw new Error('Escrow not found');
  const provider = getProvider(escrow.provider);
  const verified = await provider.verifyPayment(reference);
  escrow.status = verified.funded ? 'funded' : 'held';
  await escrow.save();
  return escrow;
}

export async function releaseEscrow({ bookingId }) {
  const escrow = await EscrowTransaction.findOne({ where: { booking_id: bookingId }, order: [['created_at', 'DESC']] });
  if (!escrow) throw new Error('Escrow not found');
  const provider = getProvider(escrow.provider);
  await provider.releaseEscrow(escrow.reference);
  escrow.status = 'released';
  await escrow.save();
  return escrow;
}