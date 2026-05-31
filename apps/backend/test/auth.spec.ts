import { describe, it, expect, beforeAll, afterAll } from 'vitest';

/**
 * Auth API Tests
 * Tests all authentication endpoints
 */

const API_URL = 'http://localhost:3000/api/v1';
let authToken = '';
let refreshToken = '';

describe('Auth API', () => {
  // Test data - Use unique email with timestamp to avoid conflicts
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123',
    firstName: 'Test',
    lastName: 'User',
    phone: '+593912345678',
    role: 'RESTAURANT_OWNER',
  };

  it('POST /auth/signup - Register new user', async () => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    expect(response.status).toBe(201 || 200);
    const data = await response.json();
    expect(data).toHaveProperty('accessToken');
    expect(data).toHaveProperty('refreshToken');
    expect(data.user).toHaveProperty('email', testUser.email);
    
    authToken = data.accessToken;
    refreshToken = data.refreshToken;
  });

  it('POST /auth/signin - Login user', async () => {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    expect([200, 201]).toContain(response.status);
    const data = await response.json();
    expect(data).toHaveProperty('accessToken');
    expect(data.user.email).toBe(testUser.email);
  });

  it('POST /auth/refresh - Refresh access token', async () => {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    expect([200, 201]).toContain(response.status);
    const data = await response.json();
    expect(data).toHaveProperty('accessToken');
  });

  it('GET /auth/me - Get current user (requires auth)', async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.email).toBe(testUser.email);
  });

  it('POST /auth/logout - Logout', async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
    });

    expect(response.status).toBe(200);
  });
});
