import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Restaurant } from '../../types/entities.types';
import { formatDistance } from '@utils/formatters';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const navigate = useNavigate();

  const isOpen =
    restaurant.openingTime && restaurant.closingTime
      ? restaurant.openingTime <= new Date().toLocaleTimeString('en-US', {
          hour12: false,
        }) &&
        restaurant.closingTime > new Date().toLocaleTimeString('en-US', { hour12: false })
      : false;

  return (
    <Card
      hoverable
      className="overflow-hidden cursor-pointer transition-transform hover:scale-105"
      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
    >
      {/* Image */}
      <div className="relative h-40 bg-secondary-200 mb-4 rounded-lg overflow-hidden">
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <svg
              className="h-12 w-12 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant={isOpen ? 'success' : 'error'} size="sm">
            {isOpen ? 'Abierto' : 'Cerrado'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg font-bold text-accent-800 mb-1 truncate">
          {restaurant.name}
        </h3>

        <p className="text-sm text-accent-600 mb-2 truncate-2">
          {restaurant.description}
        </p>

        {/* Cuisine Type */}
        <p className="text-xs text-secondary-600 mb-3">
          {restaurant.cuisineType}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {restaurant.rating !== undefined && (
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-accent-700">
                {restaurant.rating.toFixed(1)}
              </span>
            </div>
          )}

          {restaurant.distance && (
            <span className="text-xs text-secondary-600">
              {formatDistance(restaurant.distance)}
            </span>
          )}
        </div>

        {/* Time Range */}
        <p className="text-xs text-secondary-600 mt-2">
          {restaurant.openingTime} - {restaurant.closingTime}
        </p>
      </div>
    </Card>
  );
};

RestaurantCard.displayName = 'RestaurantCard';
