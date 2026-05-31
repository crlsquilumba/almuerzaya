# 🧪 Testing with CURL Examples

Manual testing commands for all endpoints.

## 🚀 Setup

```bash
# Start backend (in another terminal)
cd apps/backend
npm start:dev

# Wait for: "✅ Almuerza Ya Backend running on http://localhost:3000/api/v1"
```

## 🧪 Test Each Endpoint

### 1️⃣ Health Check (No Auth Required)

```bash
# Test health endpoint
curl -X GET http://localhost:3000/api/v1/health

# Expected response:
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-05-31T..."
}
```

### 2️⃣ Authentication

```bash
# Register new user
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@test.com",
    "password": "DevPassword123",
    "firstName": "Dev",
    "lastName": "Tester",
    "phone": "+593912345678"
  }'

# Save the accessToken from response

# Login with credentials
curl -X POST http://localhost:3000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@test.com",
    "password": "DevPassword123"
  }'
```

### 3️⃣ Restaurants (Public)

```bash
# List all restaurants
curl -X GET http://localhost:3000/api/v1/restaurants

# Get nearby restaurants
curl -X GET 'http://localhost:3000/api/v1/restaurants/nearby?latitude=-0.2226&longitude=-78.5049'

# Get single restaurant
curl -X GET http://localhost:3000/api/v1/restaurants/RESTAURANT_ID
```

### 4️⃣ Menu Items

```bash
# Get menu items for a restaurant
curl -X GET 'http://localhost:3000/api/v1/menu-items/restaurant/RESTAURANT_ID'

# Get single menu item
curl -X GET http://localhost:3000/api/v1/menu-items/MENU_ITEM_ID
```

### 5️⃣ Reservations (Requires Auth)

```bash
# Get current user's reservations
curl -X GET http://localhost:3000/api/v1/reservations \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get available time slots
curl -X GET 'http://localhost:3000/api/v1/reservations/available-slots/RESTAURANT_ID?date=2026-06-15'

# Create reservation (requires auth)
curl -X POST http://localhost:3000/api/v1/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "restaurantId": "RESTAURANT_ID",
    "reservationDate": "2026-06-15T00:00:00Z",
    "reservationTime": "19:00",
    "partySize": 4,
    "specialRequests": "Window seat"
  }'
```

### 6️⃣ Payments (Requires Auth)

```bash
# Create payment
curl -X POST http://localhost:3000/api/v1/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "reservationId": "RESERVATION_ID",
    "amount": 99.99
  }'

# Get payment details
curl -X GET http://localhost:3000/api/v1/payments/PAYMENT_ID

# Upload proof of payment
curl -X POST http://localhost:3000/api/v1/payments/PAYMENT_ID/upload-proof \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"proofUrl": "https://example.com/proof.jpg"}'
```

## 🔑 Helper Script

Save as `test-api.sh`:

```bash
#!/bin/bash

API="http://localhost:3000/api/v1"

echo "🧪 Testing Almuerza Ya API"
echo ""

# Test health
echo "Testing /health..."
curl -s $API/health | jq .

# Test restaurants
echo ""
echo "Testing /restaurants..."
curl -s $API/restaurants | jq '.data[0]'

# Test nearby
echo ""
echo "Testing /restaurants/nearby..."
curl -s "$API/restaurants/nearby?latitude=-0.2226&longitude=-78.5049" | jq .[0]

echo ""
echo "✅ Basic tests completed"
```

## 📊 Expected Responses

### Health Check
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-05-31T20:30:45.123Z"
}
```

### Restaurant List
```json
{
  "data": [
    {
      "id": "uuid-here",
      "name": "Restaurant Name",
      "address": "Address",
      "latitude": -0.2226,
      "longitude": -78.5049
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

### Auth Response
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

## ⚠️ Common Errors

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```
**Solution:** Verify email and password

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Restaurant not found"
}
```
**Solution:** Check if ID is correct

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed"
}
```
**Solution:** Check request body format

## 🔒 Getting JWT Token

1. Register or login to get token
2. Copy the `accessToken` from response
3. Use in headers: `Authorization: Bearer <token>`

Example:
```bash
TOKEN="your_access_token_here"
curl -X GET http://localhost:3000/api/v1/reservations \
  -H "Authorization: Bearer $TOKEN"
```

## 💡 Tips

- Use `jq` for pretty JSON output: `| jq .`
- Save responses: `> response.json`
- Use `-v` flag for verbose (shows headers): `curl -v ...`
- Use `-X` to specify method (GET, POST, PATCH, DELETE)
- Use `-H` to add headers
- Use `-d` for request body (JSON)

## ✅ Checklist

- [ ] Health check returns 200
- [ ] Can register user
- [ ] Can login
- [ ] Can list restaurants
- [ ] Can search nearby
- [ ] Can create reservation
- [ ] Can create payment
- [ ] All endpoints responding

All passing? **Backend is working perfectly!** 🎉
