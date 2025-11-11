import { Booking, Review } from '../models/index.js';

export async function createReview(req, res) {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ error: 'rating required' });

    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.customer_id !== req.user.id) return res.status(403).json({ error: 'Not your booking' });
    if (booking.status !== 'delivered' && booking.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed/delivered bookings' });
    }

    const exists = await Review.findOne({ where: { booking_id: bookingId, customer_id: req.user.id } });
    if (exists) return res.status(400).json({ error: 'Already reviewed' });

    const review = await Review.create({
      booking_id: bookingId,
      customer_id: req.user.id,
      tailor_id: booking.tailor_id,
      rating,
      comment,
    });
    return res.status(201).json(review);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function listTailorReviews(req, res) {
  const { tailorId } = req.params;
  const reviews = await Review.findAll({ where: { tailor_id: tailorId, approved_by_admin: true }, order: [['createdAt', 'DESC']] });
  return res.json(reviews);
}

export async function listPendingReviews(req, res) {
  const reviews = await Review.findAll({ where: { approved_by_admin: false } });
  return res.json(reviews);
}

export async function approveReview(req, res) {
  const { reviewId } = req.params;
  const review = await Review.findByPk(reviewId);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  review.approved_by_admin = true;
  await review.save();
  return res.json(review);
}

export async function rejectReview(req, res) {
  const { reviewId } = req.params;
  const review = await Review.findByPk(reviewId);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  await review.destroy();
  return res.json({ message: 'Deleted' });
}