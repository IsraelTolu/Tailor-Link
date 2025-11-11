// Provider-agnostic interface for payments (Flutterwave, Paga)

export class PaymentProvider {
  async initializeEscrow({ amount, currency, customer, booking }) {
    throw new Error('Not implemented');
  }
  async verifyPayment(reference) {
    throw new Error('Not implemented');
  }
  async releaseEscrow(reference) {
    throw new Error('Not implemented');
  }
  async refund(reference) {
    throw new Error('Not implemented');
  }
}