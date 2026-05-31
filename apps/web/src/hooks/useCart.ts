import { useCartStore } from '@store/cartStore';
import { MenuItem } from '../types/entities.types';

export const useCart = () => {
  const {
    items,
    restaurant,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setRestaurant,
    totalItems,
    totalAmount,
  } = useCartStore();

  return {
    items,
    restaurant,
    totalItems: totalItems(),
    totalAmount: totalAmount(),
    addItem: (menuItem: MenuItem, quantity: number, restaurantId: string) =>
      addItem(menuItem, quantity, restaurantId),
    removeItem,
    updateQuantity,
    clearCart,
    setRestaurant,
    isEmpty: items.length === 0,
  };
};
