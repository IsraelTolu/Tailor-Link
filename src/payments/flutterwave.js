import { PaymentProvider } from './provider.js';

const { FLW_SECRET_KEY } = process.env;

export class FlutterwaveProvider extends PaymentProvider {
  async initializeEscrow({ amount, currency, customer, booking }) {
    // TODO: Integrate Flutterwave API
    return { reference: `FLW-${Date.now()}`, amount, currency, provider: 'flutterwave' };
  }
  async verifyPayment(reference) {
    // TODO: Verify via Flutterwave
    return { reference, funded: true };
  }
  async releaseEscrow(reference) {
    // TODO: Release via Flutterwave
    return { reference, released: true };
  }
  async refund(reference) {
    // TODO: Refund via Flutterwave
    return { reference, refunded: true };
  }
}