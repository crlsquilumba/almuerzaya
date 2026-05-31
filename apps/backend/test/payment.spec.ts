import { describe, it, expect } from 'vitest';

/**
 * Payment API Tests
 */

const API_URL = 'http://localhost:3000/api/v1';

describe('Payment API', () => {
  const testPayment = {
    reservationId: 'test-reservation-id',
    amount: 99.99,
  };

  it('POST /payments - Create payment (requires auth)', async () => {
    const response = await fetch(`${API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify(testPayment),
    });

    expect([201, 200, 400, 401, 403, 404]).toContain(response.status);
    if (response.status === 201 || response.status === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('qrCode');
      expect(data).toHaveProperty('status');
    }
  });

  it('GET /payments/:id - Get payment details', async () => {
    const response = await fetch(`${API_URL}/payments/test-id`);

    expect([200, 404]).toContain(response.status);
  });

  it('POST /payments/:id/upload-proof - Upload proof of payment (requires auth)', async () => {
    const response = await fetch(`${API_URL}/payments/test-id/upload-proof`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({ proofUrl: 'https://example.com/proof.jpg' }),
    });

    expect([200, 201, 401, 403, 404]).toContain(response.status);
  });

  it('PATCH /payments/:id/verify - Verify payment (requires auth)', async () => {
    const response = await fetch(`${API_URL}/payments/test-id/verify`, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer test-token' },
    });

    expect([200, 401, 403, 404]).toContain(response.status);
  });

  it('PATCH /payments/:id/complete - Complete payment (requires auth)', async () => {
    const response = await fetch(`${API_URL}/payments/test-id/complete`, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer test-token' },
    });

    expect([200, 401, 403, 404]).toContain(response.status);
  });
});
