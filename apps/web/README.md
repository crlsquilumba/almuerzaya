# Almuerza Ya - Web Frontend

Web application for the Almuerza Ya platform, built with React 18, TypeScript, and Vite.

## Overview

This is the customer-facing web frontend for the Almuerza Ya executive lunch pre-ordering platform. It allows users to:

- Discover nearby restaurants
- View menus and add items to cart
- Create reservations with specific pickup times
- Process payments via Pichincha QR codes
- Track their orders in real-time

## Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Router**: React Router DOM v6
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies from root
cd ../..
npm install

# Or install just the web app
cd apps/web
npm install
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Update .env.local with your configuration
VITE_API_URL=http://localhost:3000/api/v1
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Type Checking

```bash
# Run TypeScript type checking
npm run type-check
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## Project Structure

```
src/
├── pages/                 # Page components (routes)
├── components/            # Reusable UI components
│   ├── layout/           # Layout components (Navbar, Footer)
│   ├── ui/               # Base UI components (Button, Input, etc.)
│   ├── restaurant/       # Restaurant-related components
│   ├── menu/             # Menu components
│   ├── cart/             # Cart components
│   ├── order/            # Order components
│   ├── payment/          # Payment components
│   └── common/           # Common components
├── store/                 # Zustand stores
│   ├── authStore.ts      # Authentication state
│   ├── cartStore.ts      # Shopping cart state
│   ├── restaurantStore.ts# Restaurants state
│   └── orderStore.ts     # Orders state
├── services/             # API services
│   ├── api.ts            # Axios instance & interceptors
│   ├── auth.service.ts   # Authentication API
│   ├── restaurant.service.ts
│   ├── reservation.service.ts
│   └── payment.service.ts
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── useGeolocation.ts
│   ├── useRestaurants.ts
│   ├── useCart.ts
│   └── useDebounce.ts
├── types/                # TypeScript type definitions
│   ├── entities.types.ts
│   ├── api.types.ts
│   └── store.types.ts
├── utils/                # Utility functions
│   ├── formatters.ts     # Format functions (price, date, etc.)
│   ├── validators.ts     # Validation functions
│   └── storage.ts        # localStorage helpers
├── config/               # Configuration
│   └── constants.ts      # App constants
├── assets/               # Static assets
├── App.tsx               # Root component
├── main.tsx              # Entry point
└── index.css             # Global styles
```

## Key Features

### Authentication

- User signup and login with JWT tokens
- Automatic token refresh via interceptors
- Persistent authentication via localStorage
- Protected routes

### Restaurants

- Geolocation-based restaurant discovery
- Distance calculation and filtering
- Open/closed status indicators
- Search and filtering capabilities

### Shopping Cart

- Add/remove items from cart
- Persist cart to localStorage
- Calculate totals automatically
- Support for multiple restaurants (with confirmation)

### Reservations

- Select pickup time with validation
- Create reservations with items
- View reservation history
- Track reservation status

### Payments

- Pichincha QR code generation
- Receipt upload capability
- Payment status tracking
- Proof verification workflow

## API Integration

The app communicates with the backend API at `http://localhost:3000/api/v1` by default.

### Main Endpoints

- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `GET /auth/me` - Get current user
- `GET /restaurants/nearby` - Find nearby restaurants
- `GET /restaurants/:id` - Get restaurant details
- `GET /restaurants/:id/menu-items` - Get menu items
- `POST /reservations` - Create reservation
- `GET /reservations` - List user reservations
- `POST /payments` - Create payment/QR
- `POST /payments/:id/upload-proof` - Upload payment proof

## Design System

The app follows a custom design system with these color tokens:

- **Primary**: #E4002B (Red - KFC-inspired)
- **Secondary**: #FFFFFF (White)
- **Accent**: #1e293b (Slate)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)

Typography uses Inter font with weights: Regular (400), Medium (500), Bold (700)

Spacing follows an 8px base unit system.

## State Management

The app uses Zustand for state management with these stores:

### AuthStore
- Manages user authentication state
- Handles login/signup/logout
- Persists token and user info to localStorage

### CartStore
- Manages shopping cart items
- Calculates totals and item count
- Persists cart to localStorage
- Validates restaurant compatibility

### RestaurantStore
- Manages restaurant list and details
- Handles menu items
- Applies filters and sorting
- Manages geolocation-based search

### OrderStore
- Manages user reservations/orders
- Tracks reservation details
- Updates order status

## Error Handling

- API errors are caught and displayed in alerts
- 401 responses trigger automatic logout and redirect to login
- Form validation errors are displayed inline
- Network errors are handled gracefully

## Performance Optimizations

- Lazy loading of pages with React.lazy
- Code splitting via Vite
- Debounced search input
- Memoized computed values
- Optimized re-renders with Zustand

## Testing

Currently no automated tests. Future additions:

- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright

## Development Workflow

1. Create a feature branch
2. Implement changes
3. Run type checking: `npm run type-check`
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Test manually in browser
7. Create pull request

## Troubleshooting

### Port 5173 already in use
```bash
# Use a different port
npm run dev -- --port 3000
```

### API connection errors
- Ensure backend is running on `http://localhost:3000`
- Check VITE_API_URL in .env.local
- Verify CORS is enabled on backend

### Geolocation not working
- Browser may block geolocation - allow permission when prompted
- App uses Quito as fallback location
- Check browser console for errors

### Token expiration
- Token expires after 7 days
- App automatically redirects to login when token expires
- Clear localStorage and login again if issues persist

## Contributing

See root project README for contribution guidelines.

## License

MIT
