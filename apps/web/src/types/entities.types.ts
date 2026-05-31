// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'ADMIN';
  restaurantId?: string; // For restaurant owners
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'CUSTOMER' | 'RESTAURANT_OWNER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  image?: string; // Frontend property
  imageUrl?: string; // Backend property (from Prisma)
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  rating?: number;
  distance?: number; // Calculated on client
  openingTime?: string;
  closingTime?: string;
  isOpen?: boolean; // Calculated on client
  cuisineType?: string;
  maxCapacity?: number;
  basePrice: number; // Base price for daily menu
  bankAccount?: string; // DeUna account for payments
  createdAt: string;
  updatedAt: string;
}

// Menu Item Types
export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  image?: string;
  category: 'Sopa' | 'Segundo' | 'Bebida' | 'Postre' | 'Entrada' | 'Extras';
  price: number;
  preparationTime?: number; // minutes
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
}

export interface Cart {
  items: CartItem[];
  restaurant: Restaurant | null;
  totalAmount: number;
  totalItems: number;
}

// Reservation Types
export interface Reservation {
  id: string;
  userId: string;
  restaurantId: string;
  reservationDate: string;
  reservationTime: string;
  status: 'pending' | 'confirmed' | 'ready_for_pickup' | 'completed' | 'cancelled';
  pickupCode?: string;
  totalAmount: number;
  itemCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationDetail extends Reservation {
  restaurant: Restaurant;
  items: ReservationItem[];
  payment?: Payment;
}

export interface ReservationItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CreateReservationPayload {
  restaurantId: string;
  reservationDate: string;
  reservationTime: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
  notes?: string;
}

// Payment Types
export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  status: 'pending' | 'received' | 'processing' | 'verified' | 'rejected';
  qrCode: string;
  proofImageUrl?: string;
  verificationNotes?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentPayload {
  reservationId: string;
  amount: number;
}

export interface UploadProofPayload {
  paymentId: string;
  proofImage: File;
}

// Filter Types
export interface RestaurantFilters {
  search: string;
  maxDistance: number;
  openNow: boolean;
  sortBy: 'distance' | 'name' | 'rating';
  cuisineType?: string;
}

// Location Types
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
