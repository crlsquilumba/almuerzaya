import api from './api';
import { ENDPOINTS, MAX_DISTANCE_KM } from '@config/constants';
import { Restaurant, MenuItem, PaginatedResponse } from '../types/entities.types';

class RestaurantService {
  async getMyRestaurant(): Promise<Restaurant> {
    console.log('🔍 [RESTAURANT SERVICE] Fetching my restaurant...');
    try {
      const response = await api.get<Restaurant>('/restaurants/mine/my-restaurant');
      console.log('✅ [RESTAURANT SERVICE] My restaurant fetched:', response.data?.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ [RESTAURANT SERVICE] Error fetching my restaurant:', error.message);
      throw error;
    }
  }

  async create(data: any): Promise<Restaurant> {
    console.log('➕ [RESTAURANT SERVICE] Creating restaurant:', data);
    const response = await api.post<Restaurant>(ENDPOINTS.RESTAURANTS, data);
    console.log('✅ [RESTAURANT SERVICE] Restaurant created successfully');
    console.log('📦 [RESTAURANT SERVICE] Full response.data:', JSON.stringify(response.data, null, 2));
    console.log('📦 [RESTAURANT SERVICE] response.data.id:', response.data?.id);
    return response.data;
  }

  async getAll(page = 1, pageSize = 20): Promise<PaginatedResponse<Restaurant>> {
    const response = await api.get<PaginatedResponse<Restaurant>>(ENDPOINTS.RESTAURANTS, {
      params: { page, pageSize },
    });
    return response.data;
  }

  async getNearby(
    latitude: number,
    longitude: number,
    maxKm: number = MAX_DISTANCE_KM
  ): Promise<Restaurant[]> {
    const response = await api.get<any>(ENDPOINTS.RESTAURANTS_NEARBY, {
      params: { latitude, longitude, maxKm },
    });
    console.log('🏪 [RESTAURANT SERVICE] getNearby response:', response.data);
    // Backend wraps response in { success, data, timestamp }
    return response.data?.data || response.data || [];
  }

  async getById(id: string): Promise<Restaurant> {
    const response = await api.get<Restaurant>(ENDPOINTS.RESTAURANT_DETAIL(id));
    return response.data;
  }

  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    const response = await api.get<MenuItem[]>(
      ENDPOINTS.RESTAURANT_MENU(restaurantId)
    );
    return response.data;
  }

}

export default new RestaurantService();
