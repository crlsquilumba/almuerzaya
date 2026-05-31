import { useEffect, useMemo } from 'react';
import { useRestaurantStore } from '@store/restaurantStore';

export const useRestaurants = (latitude: number, longitude: number, maxKm: number) => {
  const {
    restaurants,
    filters,
    isLoading,
    error,
    fetchNearbyRestaurants,
    setFilters,
  } = useRestaurantStore();

  useEffect(() => {
    fetchNearbyRestaurants(latitude, longitude, maxKm);
  }, [latitude, longitude, maxKm, fetchNearbyRestaurants]);

  // Filter and sort restaurants based on filters
  const filteredRestaurants = useMemo(() => {
    let filtered = [...restaurants];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.description?.toLowerCase().includes(searchLower) ||
          r.cuisineType?.toLowerCase().includes(searchLower)
      );
    }

    // Apply distance filter
    filtered = filtered.filter((r) => {
      const distance = r.distance || 0;
      return distance <= filters.maxDistance;
    });

    // Apply "open now" filter
    if (filters.openNow) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;

      filtered = filtered.filter((r) => {
        const openingTime = r.openingTime;
        const closingTime = r.closingTime;
        if (!openingTime || !closingTime) return true;
        return currentTime >= openingTime && currentTime <= closingTime;
      });
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'distance':
        filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [restaurants, filters]);

  return {
    restaurants: filteredRestaurants,
    allRestaurants: restaurants,
    isLoading,
    error,
    filters,
    setFilters,
  };
};
