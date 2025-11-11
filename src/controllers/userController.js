import { User, TailorProfile, PricingPlan, Review, Booking } from '../models/index.js';

export async function getUserProfile(req, res) {
  try {
    const { userId } = req.params;
    const requesterRole = req.user?.role;

    const user = await User.findByPk(userId, { attributes: ['id', 'fullname', 'role', 'createdAt', 'status'] });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.role === 'tailor') {
      const profile = await TailorProfile.findOne({ where: { user_id: userId } });
      if (!profile) return res.status(404).json({ error: 'Tailor profile not found' });
      // Customers can only view approved tailor profiles
      if (requesterRole === 'customer' && profile.approval_status !== 'approved') {
        return res.status(403).json({ error: 'Tailor not approved yet' });
      }
      const plans = await PricingPlan.findAll({ where: { user_id: userId, is_active: true }, order: [['createdAt', 'DESC']] });
      const [reviewCount, ratingSum] = await Promise.all([
        Review.count({ where: { tailor_id: userId, approved_by_admin: true } }),
        Review.sum('rating', { where: { tailor_id: userId, approved_by_admin: true } }),
      ]);
      const averageRating = reviewCount ? Number(ratingSum || 0) / reviewCount : 0;
      return res.json({ user, profile, plans, reviews: { count: reviewCount, average_rating: Number(averageRating.toFixed(2)) } });
    }

    // Customer profile: expose minimal info and booking stats
    const totalBookings = await Booking.count({ where: { customer_id: userId } });
    return res.json({ user, bookings: { total_as_customer: totalBookings } });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}