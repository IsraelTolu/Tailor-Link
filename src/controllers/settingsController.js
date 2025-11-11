import { KycRequirement } from '../models/index.js';

export async function listKycRequirements(req, res) {
  const items = await KycRequirement.findAll({ order: [['createdAt', 'DESC']] });
  return res.json(items);
}

export async function createKycRequirement(req, res) {
  try {
    const { key, label, is_required, is_active } = req.body;
    if (!key || !label) return res.status(400).json({ error: 'key and label required' });
    const item = await KycRequirement.create({ key, label, is_required, is_active });
    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function updateKycRequirement(req, res) {
  try {
    const { id } = req.params;
    const item = await KycRequirement.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    const { key, label, is_required, is_active } = req.body;
    Object.assign(item, { key, label, is_required, is_active });
    await item.save();
    return res.json(item);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function deleteKycRequirement(req, res) {
  try {
    const { id } = req.params;
    const item = await KycRequirement.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}