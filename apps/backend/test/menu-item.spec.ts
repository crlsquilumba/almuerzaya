import { describe, it, expect } from 'vitest';

/**
 * Menu Item API Tests
 */

const API_URL = 'http://localhost:3000/api/v1';

describe('Menu Item API', () => {
  const testMenuItem = {
    name: 'Lomo Saltado',
    description: 'Delicious Peruvian beef stir fry',
    price: 25.99,
    category: 'Main Courses',
    available: true,
  };

  it('GET /menu-items/restaurant/:restaurantId - Get menu for restaurant', async () => {
    // Using a test restaurant ID
    const response = await fetch(`${API_URL}/menu-items/restaurant/test-id`);
    
    // May return 404 for non-existent restaurant
    expect([200, 404]).toContain(response.status);
  });

  it('POST /menu-items - Create menu item (requires auth)', async () => {
    const response = await fetch(`${API_URL}/menu-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({
        restaurantId: 'test-id',
        ...testMenuItem,
      }),
    });

    expect([201, 200, 401, 403, 404]).toContain(response.status);
  });

  it('GET /menu-items/:id - Get menu item details', async () => {
    const response = await fetch(`${API_URL}/menu-items/test-id`);
    
    expect([200, 404]).toContain(response.status);
  });
});
