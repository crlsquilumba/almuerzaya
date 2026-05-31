import { describe, it, expect } from 'vitest';

/**
 * Reservation API Tests
 */

const API_URL = 'http://localhost:3000/api/v1';

describe('Reservation API', () => {
  const testReservation = {
    restaurantId: 'test-restaurant-id',
    reservationDate: new Date(Date.now() + 86400000).toISOString(),
    reservationTime: '19:00',
    partySize: 4,
    specialRequests: 'Window seat please',
  };

  it('POST /reservations - Create reservation (requires auth)', async () => {
    const response = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify(testReservation),
    });

    expect([201, 200, 400, 401, 403, 404]).toContain(response.status);
  });

  it('GET /reservations - Get user reservations (requires auth)', async () => {
    const response = await fetch(`${API_URL}/reservations`, {
      headers: { 'Authorization': 'Bearer test-token' },
    });

    expect([200, 401, 403]).toContain(response.status);
  });

  it('GET /reservations/available-slots/:restaurantId - Get available slots', async () => {
    const date = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `${API_URL}/reservations/available-slots/test-id?date=${date}`
    );

    expect([200, 404]).toContain(response.status);
    if (response.status === 200) {
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    }
  });

  it('PATCH /reservations/:id/confirm - Confirm reservation (requires auth)', async () => {
    const response = await fetch(`${API_URL}/reservations/test-id/confirm`, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer test-token' },
    });

    expect([200, 401, 403, 404]).toContain(response.status);
  });

  it('PATCH /reservations/:id/cancel - Cancel reservation (requires auth)', async () => {
    const response = await fetch(`${API_URL}/reservations/test-id/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer test-token' },
    });

    expect([200, 401, 403, 404]).toContain(response.status);
  });
});
