# Quick Start Guide - Almuerza Ya Web Frontend

## Overview

The **Web Frontend** for Almuerza Ya has been successfully implemented! It's a complete React 18 + TypeScript application with Vite, Zustand, and Tailwind CSS.

### Current Status
- ✅ **45 source files** created and organized
- ✅ **Fully type-safe** TypeScript configuration
- ✅ **Production-ready** build configuration
- ✅ **Development server** ready to use
- ✅ **Phase 1 & 2** complete (Setup + Core Infrastructure)

---

## Getting Started (5 Minutes)

### 1. Install Dependencies (First Time Only)

```bash
# From root directory
cd /c/bit/proyects/almuerzaya
npm install --legacy-peer-deps
```

### 2. Start the Backend API

In one terminal:
```bash
cd apps/backend
npm run dev
# Should show: "Server running at http://localhost:3000"
```

### 3. Start the Frontend Development Server

In another terminal:
```bash
cd apps/web
npm run dev
# Should show: "VITE ready in ... ms"
#              "Local: http://localhost:5173/"
```

### 4. Open in Browser

Visit: **http://localhost:5173**

You should see the Almuerza Ya home page with:
- Navigation bar with login/signup buttons
- Search and filter interface for restaurants
- Restaurant grid (currently empty - API integration needed)

---

## Available Scripts

### Development
```bash
npm run dev          # Start dev server on http://localhost:5173
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

---

## Project Structure

```
apps/web/
├── src/
│   ├── pages/              # Page components (Home, Login, Signup, etc.)
│   ├── components/         # Reusable UI components
│   ├── store/              # Zustand state management
│   ├── services/           # API client services
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── config/             # App configuration & constants
│   ├── App.tsx             # Root component with routing
│   └── main.tsx            # React entry point
├── public/                 # Static files
├── index.html              # HTML entry
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── tsconfig.json           # TypeScript config
```

---

## Key Features Implemented

### ✅ Authentication
- User login & signup with JWT tokens
- Protected routes
- Automatic token management
- Form validation

### ✅ State Management
- Zustand stores for:
  - Authentication (token, user, login/logout)
  - Shopping cart (items, restaurant, totals)
  - Restaurants (list, filters, selected)
  - Orders (reservations, details)

### ✅ UI Components
- **Layout**: Navbar, Footer, Container
- **Forms**: Input, Select
- **Feedback**: Button, Badge, Spinner, Modal, Alert
- **Features**: RestaurantCard, RestaurantList

### ✅ Design System
- Professional color palette (red primary #E4002B)
- Inter typography with 3 weights
- 8px spacing grid
- Tailwind CSS utilities

### ✅ API Integration
- Axios HTTP client with JWT interceptors
- Services for: Auth, Restaurants, Reservations, Payments
- Type-safe API responses
- Automatic 401 error handling

---

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI framework |
| TypeScript | 5.3.3 | Type safety |
| Vite | 5.0.8 | Build tool |
| Tailwind CSS | 3.3.6 | Styling |
| Zustand | 4.4.7 | State management |
| Axios | 1.6.2 | HTTP client |
| React Router | 6.20.0 | Routing |

---

## Environment Configuration

The frontend is configured to connect to the backend at:
```
http://localhost:3000/api/v1
```

If your backend is running on a different URL, update `.env.local`:
```
VITE_API_URL=http://your-backend-url/api/v1
```

---

## First Time Features to Test

### 1. Navigation
- Click the logo to go home
- Click "Ingresar" to login
- Click "Registrarse" to signup

### 2. Authentication
- Try signing up with:
  - Email: test@example.com
  - Password: TestPassword123
  - Name: Test User
  - Phone: +593912345678
- Should redirect to home if successful

### 3. Restaurant Discovery
- Allow browser geolocation (or uses Quito fallback)
- Search for restaurants (currently no data in API)
- Adjust distance slider
- Toggle "Abierto ahora" filter

---

## Implementation Phases

Currently **Phase 1 & 2** are complete:

### ✅ Phase 1: Setup Base
- Vite + React + TypeScript
- Tailwind CSS styling
- Environment configuration

### ✅ Phase 2: Core Infrastructure
- Zustand stores
- API client with interceptors
- Custom hooks
- Type definitions

### 🔄 Phase 3-10: In Progress
- Phase 3: Base UI Components ✅
- Phase 4: Authentication ✅
- Phase 5: Restaurant Discovery ✅
- Phase 6: Menu + Cart (Next)
- Phase 7: Checkout + Reservation
- Phase 8: Payment with QR
- Phase 9: Order Tracking
- Phase 10: Refinements

---

## Troubleshooting

### Port 5173 Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### API Connection Errors
1. Verify backend is running: `npm run dev -w=apps/backend`
2. Check backend is on `http://localhost:3000`
3. Check VITE_API_URL in `.env.local`
4. Check browser console for CORS errors

### TypeScript Errors
```bash
npm run type-check
```

### Build Issues
```bash
rm -rf dist
npm run build
```

---

## Development Tips

### Hot Module Reload (HMR)
- Edits to components reload instantly
- State is preserved during reload
- Very fast iteration cycle

### Type Checking as You Code
- Enable TypeScript in your IDE
- VSCode shows errors inline
- Run `npm run type-check` before commit

### Debugging
- Open DevTools (F12) in browser
- Check "React" tab for component tree
- Check "Network" tab for API calls
- Check "Console" for errors/logs

### Testing Manual Flow
1. Start both backend and frontend
2. Sign up a new user
3. Check backend database for user
4. Login with created user
5. Navigate to different pages

---

## Next Steps

### To Continue Development

1. **Phase 6: Restaurant Detail + Menu**
   - Implement menu item display
   - Add to cart functionality
   - Cart drawer with summary

2. **Phase 7: Checkout**
   - Implement checkout page
   - Time selection interface
   - Create reservation API call

3. **Phase 8: Payment**
   - Integrate QR code generation
   - Payment proof upload
   - Payment status tracking

### Environment Setup
```bash
# If not done already
cd /c/bit/proyects/almuerzaya
npm install --legacy-peer-deps

# Start development
cd apps/backend && npm run dev &
cd apps/web && npm run dev
```

---

## Important Notes

⚠️ **Backend Must Be Running**
- The frontend requires the backend API at `http://localhost:3000`
- Start backend first: `npm run dev -w=apps/backend`

🔐 **JWT Token Management**
- Tokens are stored in localStorage
- Tokens expire after 7 days
- App auto-redirects to login on expiration

🌍 **Geolocation**
- Requests browser location permission
- Falls back to Quito center if denied
- Used to find nearby restaurants

📱 **Responsive Design**
- Mobile-first approach
- Tailwind responsive classes
- Works on desktop and mobile

---

## File Checklist

The implementation includes:

- ✅ 9 Page components
- ✅ 13 UI/Layout components
- ✅ 4 Zustand stores
- ✅ 5 API services
- ✅ 5 Custom hooks
- ✅ 3 Utility modules
- ✅ 3 Type definition files
- ✅ Complete configuration

---

## Questions?

Refer to:
- `README.md` - Detailed documentation
- `IMPLEMENTATION_SUMMARY.md` - Complete overview
- Backend API docs - For endpoint details
- TypeScript files - For type definitions

---

**Ready to start?** Run:
```bash
cd /c/bit/proyects/almuerzaya/apps/web
npm run dev
```

Visit **http://localhost:5173** 🚀
