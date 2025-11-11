import { EscrowTransaction } from '../models/index.js';
import { FlutterwaveProvider } from '../payments/flutterwave.js';
import { PagaProvider } from '../payments/paga.js';

function resolveProvider(name) {
  if (name === 'flutterwave') return new FlutterwaveProvider();
  if (name === 'paga') return new PagaProvider();
  throw new Error(`Unsupported provider: ${name}`);
}

export async function listEscrow({ status, provider, page = 1, limit = 20 }) {
  const where = {};
  if (status) where.status = status;
  if (provider) where.provider = provider;
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const { rows, count } = await EscrowTransaction.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit: pageSize, offset: (pageNum - 1) * pageSize });
  return { items: rows, total: count, page: pageNum, pageSize, totalPages: Math.ceil(count / pageSize) || 1 };
}

export async function releaseByTransaction(txId) {
  const tx = await EscrowTransaction.findByPk(txId);
  if (!tx) throw new Error('Transaction not found');
  const provider = resolveProvider(tx.provider);
  const res = await provider.releaseEscrow(tx.reference);
  tx.status = 'released';
  tx.metadata = { ...(tx.metadata || {}), last_action: 'release', provider_response: res };
  await tx.save();
  return tx;
}

export async function refundByTransaction(txId) {
  const tx = await EscrowTransaction.findByPk(txId);
  if (!tx) throw new Error('Transaction not found');
  const provider = resolveProvider(tx.provider);
  const res = await provider.refund(tx.reference);
  tx.status = 'refunded';
  tx.metadata = { ...(tx.metadata || {}), last_action: 'refund', provider_response: res };
  await tx.save();
  return tx;
}