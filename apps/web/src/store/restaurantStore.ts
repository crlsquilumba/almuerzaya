import { create } from 'zustand';
import restaurantService from '@services/restaurant.service';
import { RestaurantState } from '../types/store.types';
import { Restaurant, RestaurantFilters } from '../types/entities.types';

const defaultFilters: RestaurantFilters = {
  search: '',
  maxDistance: 5,
  openNow: false,
  sortBy: 'distance',
};

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  selectedRestaurant: null,
  menuItems: [],
  filters: defaultFilters,
  isLoading: false,
  error: null,

  fetchRestaurants: async (latitude: number, longitude: number) => {
    set({ isLoading: true, error: null });
    try {
      const restaurants = await restaurantService.getNearby(latitude, longitude);
      set({ restaurants, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch restaurants';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  fetchNearbyRestaurants: async (latitude: number, longitude: number, maxKm: number) => {
    set({ isLoading: true, error: null });
    try {
      const restaurants = await restaurantService.getNearby(
        latitude,
        longitude,
        maxKm
      );
      set({ restaurants, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch nearby restaurants';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  fetchRestaurantDetail: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const restaurant = await restaurantService.getById(id);
      set({ selectedRestaurant: restaurant, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch restaurant details';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  fetchMenuItems: async (restaurantId: string) => {
    set({ isLoading: true, error: null });
    try {
      const menuItems = await restaurantService.getMenuItems(restaurantId);
      set({ menuItems, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch menu items';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  setFilters: (filters: Partial<RestaurantFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  setSelectedRestaurant: (restaurant: Restaurant | null) => {
    set({ selectedRestaurant: restaurant });
  },

  clearMenuItems: () => {
    set({ menuItems: [] });
  },
}));
