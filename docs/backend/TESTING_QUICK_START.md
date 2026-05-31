# ⚡ Quick Start - Running Tests

## 3 Simple Steps

### Step 1: Start Backend (Terminal 1)
```bash
cd apps/backend
npm start:dev
```

Wait for output:
```
✅ Almuerza Ya Backend running on http://localhost:3000/api/v1
📚 Swagger docs at http://localhost:3000/api/v1/docs
🏥 Health check at http://localhost:3000/api/v1/health
```

### Step 2: Run Tests (Terminal 2)
```bash
cd apps/backend
npm test
```

### Step 3: Check Results
Look for:
```
✓ test/auth.spec.ts
✓ test/restaurant.spec.ts
✓ test/menu-item.spec.ts
✓ test/reservation.spec.ts
✓ test/payment.spec.ts
✓ test/health.spec.ts

Test Files  6 passed (6)
     Tests  28 passed (28)
```

## ✅ Tests Included

6 test files covering **27+ endpoints**:

| Module | Tests | Endpoints |
|--------|-------|-----------|
| Auth | 5 | signup, signin, refresh, me, logout |
| Restaurants | 5 | list, nearby, create, get, pagination |
| Menu Items | 3 | create, get, get-by-restaurant |
| Reservations | 6 | create, list, get, slots, confirm, cancel |
| Payments | 5 | create, get, upload, verify, complete |
| Health | 4 | health, live, ready, performance |

## 🎯 What Gets Tested

✅ **Endpoint Accessibility** - All endpoints respond  
✅ **HTTP Status Codes** - Correct codes returned  
✅ **Response Format** - Valid JSON with expected fields  
✅ **Authentication** - Protected routes work  
✅ **Database** - Can connect and query  
✅ **Performance** - Response times < 1 second  

## 🔍 View Swagger Docs

While backend is running:
```
http://localhost:3000/api/v1/docs
```

## 📊 Expected Results

All tests should show:
```
✅ 28 tests passed
✅ 0 tests failed
✅ Database connected
✅ All endpoints responding
```

## 🐛 Troubleshooting

**Error: Cannot connect to localhost:3000**
- Make sure backend is running (check Terminal 1)
- Check port 3000 is not in use
- Try: `lsof -i :3000`

**Error: Database disconnected**
- Check .env DATABASE_URL is correct
- Verify Supabase connection
- Run: `npx prisma db push`

**Error: Health check fails**
- Backend might not be fully initialized
- Wait 2-3 seconds after starting
- Check backend logs

## ✨ All Good?

If all tests pass, your backend is:
- ✅ Fully functional
- ✅ Connected to Supabase
- ✅ Ready for frontend integration
- ✅ Production-ready

**Next:** Update frontend to consume these APIs!

---

**Pro Tip:** Keep Terminal 1 open with backend running while developing. Tests auto-reload in Terminal 2.
