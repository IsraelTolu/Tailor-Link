import { PricingPlan } from '../models/index.js';

export async function listMyPlans(req, res) {
  const plans = await PricingPlan.findAll({ where: { user_id: req.user.id } });
  return res.json(plans);
}

export async function createPlan(req, res) {
  try {
    const { name, description, price, currency } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'name and price required' });
    const plan = await PricingPlan.create({ user_id: req.user.id, name, description, price, currency });
    return res.status(201).json(plan);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function updatePlan(req, res) {
  try {
    const { planId } = req.params;
    const plan = await PricingPlan.findByPk(planId);
    if (!plan || plan.user_id !== req.user.id) return res.status(404).json({ error: 'Plan not found' });
    const { name, description, price, currency, is_active } = req.body;
    Object.assign(plan, { name, description, price, currency, is_active });
    await plan.save();
    return res.json(plan);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function deletePlan(req, res) {
  try {
    const { planId } = req.params;
    const plan = await PricingPlan.findByPk(planId);
    if (!plan || plan.user_id !== req.user.id) return res.status(404).json({ error: 'Plan not found' });
    await plan.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function listTailorPlans(req, res) {
  const { userId } = req.params;
  const plans = await PricingPlan.findAll({ where: { user_id: userId, is_active: true } });
  return res.json(plans);
}