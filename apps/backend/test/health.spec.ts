import { describe, it, expect } from 'vitest';

/**
 * Health Check API Tests
 */

const API_URL = 'http://localhost:3000/api/v1';

describe('Health API', () => {
  it('GET /health - Health check with database status', async () => {
    const response = await fetch(`${API_URL}/health`);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('database');
    expect(data).toHaveProperty('timestamp');
    expect(['healthy', 'unhealthy']).toContain(data.status);
  });

  it('GET /health/live - Liveness probe', async () => {
    const response = await fetch(`${API_URL}/health/live`);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('alive');
  });

  it('GET /health/ready - Readiness probe', async () => {
    const response = await fetch(`${API_URL}/health/ready`);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(['healthy', 'unhealthy']).toContain(data.status);
  });

  it('Response times should be fast', async () => {
    const start = Date.now();
    await fetch(`${API_URL}/health`);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000); // Should respond in less than 1 second
  });
});
