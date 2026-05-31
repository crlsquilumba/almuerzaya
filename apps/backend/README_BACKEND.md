# 🚀 Almuerza Ya Backend v2.0

**Professional NestJS Backend with PostgreSQL/Supabase**

## ✅ Status: PRODUCTION READY

### Features Implemented

✅ **Authentication**
- JWT with access & refresh tokens
- Passport.js strategy
- Secure password hashing (bcryptjs)
- Token rotation & refresh mechanism

✅ **Restaurants**
- Full CRUD operations
- Geolocation-based search (nearby)
- Pagination support
- Soft deletes

✅ **Menu Items**
- Associate items with restaurants
- Category support
- Availability flags
- Full CRUD

✅ **Reservations**
- Create & manage reservations
- Availability slot checking
- Reservation status tracking (PENDING → CONFIRMED → READY → COMPLETED)
- Soft deletes

✅ **Payments**
- Pichincha QR code generation
- Proof of payment upload
- Payment status tracking
- Verification workflow

✅ **Health & Observability**
- /health endpoint with database check
- /health/live and /health/ready probes
- Structured logging
- Request/response tracking

✅ **Security**
- Helmet.js for HTTP headers
- CORS configuration
- Input validation with Zod
- Exception filters
- JWT guards on protected routes

✅ **API Documentation**
- Swagger/OpenAPI docs at /api/v1/docs
- Fully annotated endpoints
- Bearer token authentication

## 🛠️ Technology Stack

- **Framework**: NestJS 10
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js
- **Validation**: Zod
- **Security**: Helmet, bcryptjs
- **Logging**: Pino
- **Testing**: Vitest (configured)
- **API Docs**: Swagger/OpenAPI

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL (using Supabase)
- npm or yarn

### 2. Installation
```bash
cd apps/backend
npm install
```

### 3. Environment Setup
The `.env` file is already configured with Supabase connection.

### 4. Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:dev

# Reset database (if needed)
npm run db:reset
```

### 5. Start Development Server
```bash
npm start

# Or with auto-reload
npm run start:dev
```

Server will start on: http://localhost:3000/api/v1

### 6. Access API Documentation
http://localhost:3000/api/v1/docs

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/signin` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user (requires JWT)
- `POST /api/v1/auth/logout` - Logout

### Restaurants
- `GET /api/v1/restaurants` - List all restaurants (paginated)
- `GET /api/v1/restaurants/nearby` - Find nearby restaurants
- `GET /api/v1/restaurants/:id` - Get restaurant details
- `POST /api/v1/restaurants` - Create restaurant (requires auth)
- `PATCH /api/v1/restaurants/:id` - Update restaurant (requires auth)
- `DELETE /api/v1/restaurants/:id` - Delete restaurant (requires auth)

### Menu Items
- `GET /api/v1/menu-items/restaurant/:restaurantId` - Get menu items
- `GET /api/v1/menu-items/:id` - Get menu item details
- `POST /api/v1/menu-items` - Create menu item (requires auth)
- `PATCH /api/v1/menu-items/:id` - Update menu item (requires auth)
- `DELETE /api/v1/menu-items/:id` - Delete menu item (requires auth)

### Reservations
- `POST /api/v1/reservations` - Create reservation (requires auth)
- `GET /api/v1/reservations` - Get user's reservations (requires auth)
- `GET /api/v1/reservations/:id` - Get reservation details
- `GET /api/v1/reservations/available-slots/:restaurantId` - Get available time slots
- `PATCH /api/v1/reservations/:id/confirm` - Confirm reservation (requires auth)
- `PATCH /api/v1/reservations/:id/cancel` - Cancel reservation (requires auth)

### Payments
- `POST /api/v1/payments` - Create payment (requires auth)
- `GET /api/v1/payments/:id` - Get payment details
- `POST /api/v1/payments/:id/upload-proof` - Upload proof of payment (requires auth)
- `PATCH /api/v1/payments/:id/verify` - Verify payment (requires auth)
- `PATCH /api/v1/payments/:id/complete` - Mark payment as complete (requires auth)

### Health
- `GET /api/v1/health` - Health check with database status
- `GET /api/v1/health/live` - Liveness probe
- `GET /api/v1/health/ready` - Readiness probe

## 📁 Project Structure

```
src/
├── app.module.ts           # Root module
├── app.controller.ts       # Root controller
├── app.service.ts          # Root service
├── main.ts                 # Entry point
├── common/                 # Cross-cutting concerns
│   ├── filters/           # Exception filters
│   └── interceptors/      # Logging interceptors
├── shared/                # Shared utilities
│   ├── database/          # Prisma setup
│   ├── health/            # Health checks
│   └── logger/            # Logging
└── modules/               # Feature modules
    ├── auth/              # Authentication
    ├── restaurant/        # Restaurant management
    ├── menu-item/         # Menu items
    ├── reservation/       # Reservations
    └── payment/           # Payments
```

## 🔐 Environment Variables

All required variables are set in `.env`:

- `DATABASE_URL` - Supabase PostgreSQL connection string
- `NODE_ENV` - development/production
- `PORT` - API port (default: 3000)
- `JWT_SECRET` - JWT signing secret
- `CORS_ORIGIN` - Allowed origins for CORS

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm test:watch

# Coverage
npm test:cov
```

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Run Production Server
```bash
npm run start:prod
```

### Docker (Coming Soon)
```bash
docker build -t almuerzaya-backend .
docker run -p 3000:3000 almuerzaya-backend
```

## 📊 Database Schema

**Users**
- id, email, password, firstName, lastName, phone, role
- Relationships: restaurants, reservations, payments

**Restaurants**
- id, name, address, phone, email, latitude, longitude, ownerId
- Relationships: menuItems, reservations, payments

**MenuItems**
- id, name, description, price, category, available, restaurantId
- Relationships: reservationItems

**Reservations**
- id, reservationCode, userId, restaurantId, date, time, status
- Relationships: items, payment

**Payments**
- id, paymentCode, amount, status, method, qrCode, proofUrl

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test connection
npm run prisma:generate
```

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

### Reset Database
```bash
npm run db:reset
```

## 📝 License

MIT

## 👨‍💼 Author

Almuerza Ya Team

---

**Status**: ✅ Production Ready  
**Last Updated**: May 2026  
**Version**: 2.0.0
