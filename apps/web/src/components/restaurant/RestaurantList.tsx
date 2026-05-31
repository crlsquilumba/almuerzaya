import React from 'react';
import { RestaurantCard } from './RestaurantCard';
import { Restaurant } from '../../types/entities.types';

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="h-16 w-16 mx-auto text-secondary-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4v2m0 4v2M9 9h.01M15 9h.01M9 15h.01M15 15h.01"
          />
        </svg>
        <h3 className="text-xl font-semibold text-accent-800 mb-2">
          No hay restaurantes disponibles
        </h3>
        <p className="text-accent-600">
          Intenta ajustar tus filtros o aumentar la distancia máxima
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
};

RestaurantList.displayName = 'RestaurantList';
