import { create } from 'zustand';
import reservationService from '@services/reservation.service';
import { OrderState } from '../types/store.types';
import { Reservation } from '../types/entities.types';

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const orders = await reservationService.getAll();
      set({ orders, isLoading: false });
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to fetch orders';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  fetchOrderDetail: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await reservationService.getById(id);
      set({
        selectedOrder: order as any,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to fetch order details';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  setSelectedOrder: (order: Reservation | null) => {
    set({ selectedOrder: order });
  },

  updateOrderStatus: (id: string, status: string) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status: status as any } : order
      ),
      selectedOrder:
        state.selectedOrder?.id === id
          ? { ...state.selectedOrder, status: status as any }
          : state.selectedOrder,
    }));
  },

  addOrder: (order: Reservation) => {
    set((state) => ({
      orders: [order, ...state.orders],
    }));
  },
}));
