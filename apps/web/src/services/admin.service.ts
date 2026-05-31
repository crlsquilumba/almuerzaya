import { api } from './api';

export interface AdminRestaurant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  isActive: boolean;
  subscriptionStatus: 'active' | 'suspended' | 'expired';
  rating: number;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'customer' | 'restaurant_owner' | 'admin';
  isActive: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalRestaurants: number;
  activeRestaurants: number;
  totalUsers: number;
  totalRevenue: number;
}

class AdminService {
  async getRestaurants(): Promise<AdminRestaurant[]> {
    try {
      console.log('🏢 [ADMIN] Fetching all restaurants...');
      const { data } = await api.get('/admin/restaurants');
      console.log('✅ [ADMIN] Restaurants fetched successfully');
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('❌ [ADMIN] Error fetching restaurants:', error);
      return [];
    }
  }

  async updateRestaurantStatus(
    restaurantId: string,
    status: 'active' | 'suspended'
  ): Promise<AdminRestaurant | null> {
    try {
      console.log(`🔄 [ADMIN] Updating restaurant ${restaurantId} status to ${status}`);
      const { data } = await api.patch(`/admin/restaurants/${restaurantId}`, { status });
      console.log('✅ [ADMIN] Restaurant status updated successfully');
      return data.data || data;
    } catch (error) {
      console.error('❌ [ADMIN] Error updating restaurant status:', error);
      return null;
    }
  }

  async getUsers(): Promise<AdminUser[]> {
    try {
      console.log('👥 [ADMIN] Fetching all users...');
      const { data } = await api.get('/admin/users');
      console.log('✅ [ADMIN] Users fetched successfully');
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('❌ [ADMIN] Error fetching users:', error);
      return [];
    }
  }

  async toggleUserActive(userId: string): Promise<AdminUser | null> {
    try {
      console.log(`🔄 [ADMIN] Toggling active status for user ${userId}`);
      const { data } = await api.patch(`/admin/users/${userId}/toggle-active`);
      console.log('✅ [ADMIN] User status toggled successfully');
      return data.data || data;
    } catch (error) {
      console.error('❌ [ADMIN] Error toggling user status:', error);
      return null;
    }
  }

  async getStats(): Promise<AdminStats | null> {
    try {
      console.log('📊 [ADMIN] Fetching admin stats...');
      const { data } = await api.get('/admin/stats');
      console.log('✅ [ADMIN] Stats fetched successfully');
      return data.data || data;
    } catch (error) {
      console.error('❌ [ADMIN] Error fetching stats:', error);
      return null;
    }
  }

  async getRestaurantDetail(restaurantId: string): Promise<AdminRestaurant | null> {
    try {
      console.log(`🏢 [ADMIN] Fetching restaurant details for ${restaurantId}`);
      const { data } = await api.get(`/admin/restaurants/${restaurantId}`);
      console.log('✅ [ADMIN] Restaurant details fetched successfully');
      return data.data || data;
    } catch (error) {
      console.error('❌ [ADMIN] Error fetching restaurant details:', error);
      return null;
    }
  }

  async getUserDetail(userId: string): Promise<AdminUser | null> {
    try {
      console.log(`👤 [ADMIN] Fetching user details for ${userId}`);
      const { data } = await api.get(`/admin/users/${userId}`);
      console.log('✅ [ADMIN] User details fetched successfully');
      return data.data || data;
    } catch (error) {
      console.error('❌ [ADMIN] Error fetching user details:', error);
      return null;
    }
  }
}

export default new AdminService();
