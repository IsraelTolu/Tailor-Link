import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { GalleryItem } from '../models/index.js';

const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join('storage', 'gallery', req.user.id);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ts = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `image-${ts}${ext}`);
  },
});

function imageOnlyFilter(req, file, cb) {
  if (file.mimetype && file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'));
}

export const uploadGallery = multer({
  storage: galleryStorage,
  fileFilter: imageOnlyFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export async function handleGalleryUpload(req, res) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'image file required' });
    const item = await GalleryItem.create({
      user_id: req.user.id,
      image_path: file.path.replace(/\\/g, '/'),
      original_name: file.originalname,
      mime_type: file.mimetype,
      size_bytes: file.size,
      is_active: true,
    });
    const publicUrl = `/api/gallery/${req.user.id}/${path.basename(file.path)}`;
    return res.status(201).json({ ...item.toJSON(), url: publicUrl });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function listTailorGallery(req, res) {
  const { userId } = req.params;
  const items = await GalleryItem.findAll({ where: { user_id: userId, is_active: true }, order: [['createdAt', 'DESC']] });
  const withUrls = items.map((it) => ({
    ...it.toJSON(),
    url: `/api/gallery/${userId}/${path.basename(it.image_path)}`,
  }));
  return res.json(withUrls);
}