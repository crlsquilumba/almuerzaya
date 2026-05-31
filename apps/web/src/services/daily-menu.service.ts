import { api } from './api';

export interface DailyMenuData {
  nombre: string;
  imagen?: string;
  price?: number;
  sopaName: string;
  sopaExtras?: string;
  proteinaName: string;
  guarniciones?: string;
  ensalada?: string;
  bebida?: string;
  postre?: string;
  isActive?: boolean;
  restaurantId?: string;
}

export interface DailyMenu extends DailyMenuData {
  id: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

class DailyMenuService {
  async create(restaurantId: string, data: Omit<DailyMenuData, 'restaurantId'>) {
    const payload = {
      ...data,
      restaurantId,
    };
    console.log('🔍 [DAILY-MENU-SERVICE] Payload with restaurantId:', JSON.stringify(payload, null, 2));
    const response = await api.post<DailyMenu>('/daily-menus', payload);
    return response.data;
  }

  async getByRestaurant(restaurantId: string) {
    const response = await api.get<DailyMenu[]>(`/daily-menus/${restaurantId}`);
    return response.data;
  }

  async getById(id: string) {
    const response = await api.get<DailyMenu>(`/daily-menus/${id}/detail`);
    return response.data;
  }

  async update(id: string, restaurantId: string, data: Partial<DailyMenuData>) {
    const response = await api.put<DailyMenu>(`/daily-menus/${id}`, {
      ...data,
      restaurantId,
    });
    return response.data;
  }

  async activateToday(id: string, restaurantId: string) {
    const response = await api.put<DailyMenu>(`/daily-menus/${id}/activate`, {
      restaurantId,
    });
    return response.data;
  }

  async delete(id: string) {
    const response = await api.delete<DailyMenu>(`/daily-menus/${id}`);
    return response.data;
  }
}

export default new DailyMenuService();
