import api from './api';
import { Reservation } from '../types/entities.types';

class ReservationService {
  async getAll(): Promise<Reservation[]> {
    try {
      console.log('📦 [RESERVATION] Fetching all reservations...');
      const response = await api.get('/reservations');
      console.log(`✅ [RESERVATION] Got ${response.data?.data?.length || 0} reservations`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('❌ [RESERVATION] Error fetching all reservations:', error);
      return [];
    }
  }

  async getByStatus(status: string): Promise<Reservation[]> {
    try {
      console.log(`📦 [RESERVATION] Fetching reservations with status: ${status}`);
      const response = await api.get('/reservations', {
        params: { status },
      });
      console.log(`✅ [RESERVATION] Got ${response.data?.data?.length || 0} reservations`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('❌ [RESERVATION] Error fetching by status:', error);
      return [];
    }
  }

  async confirm(reservationId: string): Promise<Reservation | null> {
    try {
      console.log(`✅ [RESERVATION] Confirming ${reservationId}`);
      const response = await api.patch(`/reservations/${reservationId}/confirm`);
      console.log(`✅ [RESERVATION] Reservation confirmed successfully`);
      return response.data?.data || response.data || null;
    } catch (error) {
      console.error('❌ [RESERVATION] Error confirming:', error);
      return null;
    }
  }

  async cancel(reservationId: string): Promise<Reservation | null> {
    try {
      console.log(`❌ [RESERVATION] Cancelling ${reservationId}`);
      const response = await api.patch(`/reservations/${reservationId}/cancel`);
      console.log(`✅ [RESERVATION] Reservation cancelled successfully`);
      return response.data?.data || response.data || null;
    } catch (error) {
      console.error('❌ [RESERVATION] Error cancelling:', error);
      return null;
    }
  }

  async getAvailableSlots(restaurantId: string, date: string): Promise<any[]> {
    try {
      console.log(`📅 [RESERVATION] Fetching available slots for ${restaurantId} on ${date}`);
      const response = await api.get(`/reservations/available-slots/${restaurantId}`, {
        params: { date },
      });
      console.log(`✅ [RESERVATION] Available slots fetched`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('❌ [RESERVATION] Error fetching slots:', error);
      return [];
    }
  }

  async getById(reservationId: string): Promise<Reservation | null> {
    try {
      console.log(`📖 [RESERVATION] Fetching reservation ${reservationId}`);
      const response = await api.get(`/reservations/${reservationId}`);
      return response.data?.data || response.data || null;
    } catch (error) {
      console.error('❌ [RESERVATION] Error fetching by ID:', error);
      return null;
    }
  }

  async create(reservationData: any): Promise<Reservation | null> {
    try {
      console.log(`➕ [RESERVATION] Creating new reservation`);
      const response = await api.post('/reservations', reservationData);
      return response.data?.data || response.data || null;
    } catch (error) {
      console.error('❌ [RESERVATION] Error creating reservation:', error);
      return null;
    }
  }
}

export default new ReservationService();
