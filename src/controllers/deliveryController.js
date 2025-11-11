import { initiateDelivery, updateDeliveryStatus } from '../services/deliveryService.js';

export async function initiateDeliveryHandler(req, res) {
  try {
    const { bookingId } = req.params;
    const { carrier } = req.body;
    const tracking = await initiateDelivery({ bookingId, carrier });
    return res.status(201).json(tracking);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

export async function updateDeliveryStatusHandler(req, res) {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const tracking = await updateDeliveryStatus({ bookingId, status });
    return res.json(tracking);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}