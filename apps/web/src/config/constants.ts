export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Almuerza Ya';
export const APP_DESCRIPTION =
  import.meta.env.VITE_APP_DESCRIPTION ||
  'Zero-Wait Executive Lunch Pre-Ordering Platform';

export const MAX_DISTANCE_KM = parseInt(import.meta.env.VITE_MAX_DISTANCE_KM || '5', 10);

export const RESERVATION_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  READY_FOR_PICKUP: 'ready_for_pickup',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  RECEIVED: 'received',
  PROCESSING: 'processing',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export const TOAST_DURATION = 5000; // 5 seconds

export const DEBOUNCE_DELAY = 300; // 300ms

export const AUTH_TOKEN_KEY = 'almuerzaya-auth-token';
export const USER_KEY = 'almuerzaya-user';
export const CART_KEY = 'almuerzaya-cart';

// API Endpoints
export const ENDPOINTS = {
  // Auth
  SIGNUP: '/auth/signup',
  SIGNIN: '/auth/signin',
  ME: '/auth/me',
  LOGOUT: '/auth/logout',

  // Restaurants
  RESTAURANTS: '/restaurants',
  RESTAURANTS_NEARBY: '/restaurants/nearby',
  RESTAURANT_DETAIL: (id: string) => `/restaurants/${id}`,
  RESTAURANT_MENU: (id: string) => `/menu-items/restaurant/${id}`,

  // Reservations
  RESERVATIONS: '/reservations',
  RESERVATION_DETAIL: (id: string) => `/reservations/${id}`,
  RESERVATION_CONFIRM: (id: string) => `/reservations/${id}/confirm`,
  RESERVATION_CANCEL: (id: string) => `/reservations/${id}/cancel`,
  RESERVATION_AVAILABLE_SLOTS: (id: string) => `/reservations/available-slots/${id}`,

  // Payments
  PAYMENTS: '/payments',
  PAYMENT_DETAIL: (id: string) => `/payments/${id}`,
  PAYMENT_UPLOAD_PROOF: (id: string) => `/payments/${id}/upload-proof`,

} as const;

export const WORKING_HOURS = {
  START: '11:00',
  END: '22:00',
  INTERVAL_MINUTES: 15,
} as const;
