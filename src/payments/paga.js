import { PaymentProvider } from './provider.js';

const { PAGA_API_KEY } = process.env;

export class PagaProvider extends PaymentProvider {
  async initializeEscrow({ amount, currency, customer, booking }) {
    // TODO: Integrate Paga API
    return { reference: `PAGA-${Date.now()}`, amount, currency, provider: 'paga' };
  }
  async verifyPayment(reference) {
    // TODO: Verify via Paga
    return { reference, funded: true };
  }
  async releaseEscrow(reference) {
    // TODO: Release via Paga
    return { reference, released: true };
  }
  async refund(reference) {
    // TODO: Refund via Paga
    return { reference, refunded: true };
  }
}