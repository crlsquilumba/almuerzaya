import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import adminService, { AdminRestaurant } from '@services/admin.service';

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
};

const subscriptionStatusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  expired: 'bg-yellow-100 text-yellow-800',
};

export const AdminRestaurants: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        console.log('📍 [ADMIN] Fetching restaurants...');
        setIsLoading(true);
        const data = await adminService.getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('❌ [ADMIN] Error fetching restaurants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleToggleStatus = async (restaurantId: string, newStatus: 'active' | 'suspended') => {
    try {
      console.log(`🔄 [ADMIN] Updating restaurant ${restaurantId} to ${newStatus}`);
      const updated = await adminService.updateRestaurantStatus(restaurantId, newStatus);

      if (updated) {
        setRestaurants(
          restaurants.map((r) =>
            r.id === restaurantId ? { ...r, isActive: newStatus === 'active' } : r
          )
        );
        console.log('✅ [ADMIN] Restaurant status updated successfully');
      }
    } catch (error) {
      console.error('❌ [ADMIN] Error toggling status:', error);
    }
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex gap-4 items-center">
          <Button variant="secondary" onClick={() => navigate('/admin')}>
            ← Volver
          </Button>
          <h1 className="text-4xl font-bold text-accent-800">
            📍 Gestión de Restaurantes
          </h1>
        </div>

        {/* Restaurants List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-accent-800">
                        {restaurant.name}
                      </h3>
                      <Badge className={statusColors[restaurant.isActive ? 'active' : 'suspended']}>
                        {restaurant.isActive ? 'Activo' : 'Suspendido'}
                      </Badge>
                      <Badge className={subscriptionStatusColors[restaurant.subscriptionStatus]}>
                        {restaurant.subscriptionStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-accent-600 mb-1">
                      {restaurant.address}
                    </p>
                    <p className="text-sm text-accent-600">
                      {restaurant.email} • {restaurant.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-500 mb-2">
                      ⭐ {restaurant.rating}
                    </p>
                    <p className="text-xs text-accent-600">
                      Desde: {restaurant.createdAt}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-accent-200">
                  {restaurant.isActive ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleToggleStatus(restaurant.id, 'suspended')}
                    >
                      🚫 Suspender
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleToggleStatus(restaurant.id, 'active')}
                    >
                      ✓ Activar
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default AdminRestaurants;
