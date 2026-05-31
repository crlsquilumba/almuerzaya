import { useEffect, useState } from 'react';
import { useAuthStore } from '@store/authStore';
import restaurantService from '@services/restaurant.service';
import { Restaurant } from '../types/entities.types';

export const useMyRestaurant = () => {
  const { user } = useAuthStore();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log('📍 [HOOK] Fetching restaurant for user:', user.id);

        // Obtener todos los restaurantes y filtrar por owner (userId)
        const response = await restaurantService.getAll();

        // Asumir que el usuario solo tiene un restaurante
        // o filtrar por ownerId si está disponible
        const userRestaurant = response.data?.find(
          (r: any) => r.ownerId === user.id
        ) || null;

        if (!userRestaurant) {
          setError('No restaurant found for this user');
          console.warn('⚠️ [HOOK] No restaurant found for user:', user.id);
        } else {
          setRestaurant(userRestaurant);
          console.log('✅ [HOOK] Restaurant loaded:', userRestaurant.name);
        }
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || err.message || 'Error loading restaurant';
        setError(errorMsg);
        console.error('❌ [HOOK] Error fetching restaurant:', errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [user?.id]);

  return { restaurant, isLoading, error };
};
