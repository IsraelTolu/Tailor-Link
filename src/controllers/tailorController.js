import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { TailorProfile, KycDocument } from '../models/index.js';
import { PricingPlan, Review, User } from '../models/index.js';

export async function getMyProfile(req, res) {
  const profile = await TailorProfile.findOne({ where: { user_id: req.user.id } });
  return res.json(profile || {});
}

export async function upsertProfile(req, res) {
  try {
    const { bio, address_line, city, state, country } = req.body;
    const [profile] = await TailorProfile.upsert({
      user_id: req.user.id,
      bio,
      address_line,
      city,
      state,
      country,
    });
    return res.json(profile);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function setAvailability(req, res) {
  try {
    const { availability } = req.body;
    const profile = await TailorProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    profile.availability = Boolean(availability);
    await profile.save();
    return res.json({ availability: profile.availability });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// Multer storage for KYC files
const kycStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join('storage', 'kyc', req.user.id);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ts = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${ts}${ext}`);
  },
});

export const uploadKyc = multer({
  storage: kycStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export async function handleKycUpload(req, res) {
  try {
    const { type } = req.body; // govt_id, address_proof, etc.
    if (!type) return res.status(400).json({ error: 'type required' });
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'file required' });
    const doc = await KycDocument.create({
      user_id: req.user.id,
      type,
      file_path: file.path.replace(/\\/g, '/'),
      original_name: file.originalname,
      mime_type: file.mimetype,
      size_bytes: file.size,
    });
    return res.status(201).json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function getPublicTailorProfile(req, res) {
  try {
    const { userId } = req.params;
    const profile = await TailorProfile.findOne({ where: { user_id: userId } });
    if (!profile) return res.status(404).json({ error: 'Tailor profile not found' });
    if (profile.approval_status !== 'approved') return res.status(403).json({ error: 'Tailor not approved yet' });
    const user = await User.findByPk(userId, { attributes: ['id', 'fullname', 'role', 'createdAt'] });
    const plans = await PricingPlan.findAll({ where: { user_id: userId, is_active: true }, order: [['createdAt', 'DESC']] });
    const [reviewCount, ratingSum] = await Promise.all([
      Review.count({ where: { tailor_id: userId, approved_by_admin: true } }),
      Review.sum('rating', { where: { tailor_id: userId, approved_by_admin: true } }),
    ]);
    const averageRating = reviewCount ? Number(ratingSum || 0) / reviewCount : 0;
    return res.json({ user, profile, plans, reviews: { count: reviewCount, average_rating: Number(averageRating.toFixed(2)) } });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function searchTailors(req, res) {
  try {
    const { city, state, available, page = 1, limit = 10, approval = 'approved' } = req.query;
    const where = {};
    if (city) where.city = city;
    if (state) where.state = state;
    if (available !== undefined) where.availability = String(available).toLowerCase() === 'true';
    if (approval) where.approval_status = approval;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const { rows, count } = await TailorProfile.findAndCountAll({
      where,
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
      order: [['updatedAt', 'DESC']],
    });

    return res.json({ items: rows, total: count, page: pageNum, pageSize, totalPages: Math.ceil(count / pageSize) || 1 });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}