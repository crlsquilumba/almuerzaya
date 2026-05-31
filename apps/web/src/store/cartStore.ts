import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState } from '../types/store.types';
import { MenuItem, Restaurant, CartItem } from '../types/entities.types';
import { CART_KEY } from '@config/constants';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurant: null,
      isLoading: false,

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      addItem: (menuItem: MenuItem, quantity: number, restaurantId: string) => {
        set((state) => {
          // If adding from a different restaurant, clear cart
          if (state.restaurant && state.restaurant.id !== restaurantId) {
            return {
              items: [
                {
                  menuItemId: menuItem.id,
                  name: menuItem.name,
                  price: menuItem.price,
                  quantity,
                  restaurantId,
                },
              ],
            };
          }

          // Check if item already exists
          const existingItem = state.items.find(
            (item) => item.menuItemId === menuItem.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.menuItemId === menuItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // Add new item
          return {
            items: [
              ...state.items,
              {
                menuItemId: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity,
                restaurantId,
              },
            ],
          };
        });
      },

      removeItem: (menuItemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.menuItemId !== menuItemId),
        }));
      },

      updateQuantity: (menuItemId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.menuItemId !== menuItemId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.menuItemId === menuItemId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          restaurant: null,
        });
      },

      setRestaurant: (restaurant: Restaurant) => {
        set({ restaurant });
      },

      setItems: (items: CartItem[]) => {
        set({ items });
      },
    }),
    {
      name: CART_KEY,
    }
  )
);
