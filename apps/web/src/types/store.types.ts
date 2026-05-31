import { User, Restaurant, MenuItem, CartItem, Reservation, RestaurantFilters } from './entities.types';

// Auth Store
export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, phone: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

// Cart Store
export interface CartState {
  items: CartItem[];
  restaurant: Restaurant | null;
  isLoading: boolean;

  // Computed getters
  totalItems: () => number;
  totalAmount: () => number;

  // Actions
  addItem: (menuItem: MenuItem, quantity: number, restaurantId: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setRestaurant: (restaurant: Restaurant) => void;
  setItems: (items: CartItem[]) => void;
}

// Restaurant Store
export interface RestaurantState {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  menuItems: MenuItem[];
  filters: RestaurantFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchRestaurants: (latitude: number, longitude: number) => Promise<void>;
  fetchNearbyRestaurants: (latitude: number, longitude: number, maxKm: number) => Promise<void>;
  fetchRestaurantDetail: (id: string) => Promise<void>;
  fetchMenuItems: (restaurantId: string) => Promise<void>;
  setFilters: (filters: Partial<RestaurantFilters>) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  clearMenuItems: () => void;
}

// Order Store
export interface OrderState {
  orders: Reservation[];
  selectedOrder: Reservation | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOrders: () => Promise<void>;
  fetchOrderDetail: (id: string) => Promise<void>;
  setSelectedOrder: (order: Reservation | null) => void;
  updateOrderStatus: (id: string, status: string) => void;
  addOrder: (order: Reservation) => void;
}
