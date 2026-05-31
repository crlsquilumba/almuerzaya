# 🧪 Almuerza Ya Backend - Test Suite

Complete test coverage for all API endpoints.

## 📋 Test Files

| Test File | Endpoints Covered | Status |
|-----------|------------------|--------|
| `auth.spec.ts` | 5 endpoints | ✅ Ready |
| `restaurant.spec.ts` | 5 endpoints | ✅ Ready |
| `menu-item.spec.ts` | 3 endpoints | ✅ Ready |
| `reservation.spec.ts` | 6 endpoints | ✅ Ready |
| `payment.spec.ts` | 5 endpoints | ✅ Ready |
| `health.spec.ts` | 3 endpoints | ✅ Ready |
| **TOTAL** | **27 endpoints** | ✅ **Ready** |

## 🚀 Running Tests

### Prerequisites
1. Backend must be running on `http://localhost:3000`
2. Tests require network access to localhost

### Start Backend (Terminal 1)
```bash
cd apps/backend
npm start:dev
```

### Run Tests (Terminal 2)

#### Run all tests:
```bash
npm test
```

#### Run specific test file:
```bash
npm test test/auth.spec.ts
npm test test/restaurant.spec.ts
npm test test/health.spec.ts
```

#### Run tests in watch mode:
```bash
npm test:watch
```

#### Run with coverage:
```bash
npm test:cov
```

#### Run test runner script:
```bash
bash test/run-tests.sh
```

## 📝 Test Coverage

### Auth API Tests
- ✅ `POST /auth/signup` - Register new user
- ✅ `POST /auth/signin` - Login
- ✅ `POST /auth/refresh` - Refresh token
- ✅ `GET /auth/me` - Get current user (protected)
- ✅ `POST /auth/logout` - Logout

### Restaurant API Tests
- ✅ `GET /restaurants` - List all restaurants
- ✅ `GET /restaurants/nearby` - Find nearby restaurants
- ✅ `POST /restaurants` - Create restaurant (protected)
- ✅ `GET /restaurants/:id` - Get details
- ✅ Pagination support

### Menu Item API Tests
- ✅ `GET /menu-items/restaurant/:restaurantId` - Get menu
- ✅ `POST /menu-items` - Create item (protected)
- ✅ `GET /menu-items/:id` - Get item details

### Reservation API Tests
- ✅ `POST /reservations` - Create reservation (protected)
- ✅ `GET /reservations` - Get user reservations (protected)
- ✅ `GET /reservations/available-slots/:restaurantId` - Get slots
- ✅ `PATCH /reservations/:id/confirm` - Confirm (protected)
- ✅ `PATCH /reservations/:id/cancel` - Cancel (protected)
- ✅ `GET /reservations/:id` - Get details

### Payment API Tests
- ✅ `POST /payments` - Create payment (protected)
- ✅ `GET /payments/:id` - Get payment
- ✅ `POST /payments/:id/upload-proof` - Upload proof (protected)
- ✅ `PATCH /payments/:id/verify` - Verify (protected)
- ✅ `PATCH /payments/:id/complete` - Complete (protected)

### Health API Tests
- ✅ `GET /health` - Health check
- ✅ `GET /health/live` - Liveness probe
- ✅ `GET /health/ready` - Readiness probe
- ✅ Performance check (< 1 second response)

## 🎯 Test Results Expectations

### Successful Tests
- Health endpoints should return 200
- Public endpoints (GET /restaurants, GET /health) should return 200
- Protected endpoints without auth should return 401 or 403
- Endpoints with non-existent IDs should return 404

### Sample Output
```
✓ test/auth.spec.ts (5 tests)
✓ test/restaurant.spec.ts (5 tests)
✓ test/menu-item.spec.ts (3 tests)
✓ test/reservation.spec.ts (6 tests)
✓ test/payment.spec.ts (5 tests)
✓ test/health.spec.ts (4 tests)

Test Files  6 passed (6)
     Tests  28 passed (28)
```

## 🔐 Authentication Notes

Tests that require JWT tokens will use mock tokens. For full integration testing with real authentication:

1. Register a test user via `POST /auth/signup`
2. Copy the returned `accessToken`
3. Use it in test headers: `Authorization: Bearer <token>`

Example:
```javascript
const response = await fetch(`${API_URL}/reservations`, {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'
  }
});
```

## 📊 Test Execution Time

Expected time to run full suite: **30-60 seconds**

## 🐛 Debugging Tests

### View detailed output:
```bash
npm test -- --reporter=verbose
```

### Run single test:
```bash
npm test -- test/health.spec.ts --reporter=verbose
```

### Debug with Node inspector:
```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs run test/health.spec.ts
```

## ✅ All Tests Pass?

If all tests pass:
- ✅ Database connection is working
- ✅ All endpoints are accessible
- ✅ Response formats are correct
- ✅ Error handling is working
- ✅ Backend is production-ready

## 🚢 Next Steps After Testing

1. **Frontend Integration** - Update frontend to use real API
2. **Load Testing** - Test with more concurrent requests
3. **Security Testing** - Add more security-focused tests
4. **Performance Testing** - Add benchmarks for slow endpoints
5. **CI/CD Integration** - Add tests to deployment pipeline

---

**Last Updated:** May 2026  
**Backend Version:** 2.0.0  
**Test Framework:** Vitest
