import { api } from './api';
import { MenuItem } from '../types/entities.types';

class MenuItemService {
  async getByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    try {
      console.log(`📋 [MENU] Fetching menu items for restaurant ${restaurantId}`);
      const { data } = await api.get(`/restaurants/${restaurantId}/menu-items`);
      console.log('✅ [MENU] Menu items fetched successfully');
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('❌ [MENU] Error fetching menu items:', error);
      return [];
    }
  }

  async create(menuItem: Partial<MenuItem>): Promise<MenuItem | null> {
    try {
      console.log('➕ [MENU] Creating new menu item:', menuItem);
      const { data } = await api.post('/menu-items', menuItem);
      console.log('✅ [MENU] Menu item created successfully');
      return data.data || data;
    } catch (error) {
      console.error('❌ [MENU] Error creating menu item:', error);
      return null;
    }
  }

  async update(itemId: string, menuItem: Partial<MenuItem>): Promise<MenuItem | null> {
    try {
      console.log(`🔄 [MENU] Updating menu item ${itemId}:`, menuItem);
      const { data } = await api.put(`/menu-items/${itemId}`, menuItem);
      console.log('✅ [MENU] Menu item updated successfully');
      return data.data || data;
    } catch (error) {
      console.error('❌ [MENU] Error updating menu item:', error);
      return null;
    }
  }

  async toggleAvailability(itemId: string, available: boolean): Promise<MenuItem | null> {
    try {
      console.log(`🔄 [MENU] Toggling availability for item ${itemId} to ${available}`);
      const { data } = await api.patch(`/menu-items/${itemId}`, { available });
      console.log('✅ [MENU] Menu item availability toggled successfully');
      return data.data || data;
    } catch (error) {
      console.error('❌ [MENU] Error toggling availability:', error);
      return null;
    }
  }

  async delete(itemId: string): Promise<boolean> {
    try {
      console.log(`🗑️ [MENU] Deleting menu item ${itemId}`);
      await api.delete(`/menu-items/${itemId}`);
      console.log('✅ [MENU] Menu item deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ [MENU] Error deleting menu item:', error);
      return false;
    }
  }
}

export default new MenuItemService();
