import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@store/authStore';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import adminService, { AdminStats } from '@services/admin.service';

export const AdminDashboard: React.FC = () => {
  const { logout } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('👨‍💼 [ADMIN] Fetching admin stats...');
        setIsLoading(true);
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error('❌ [ADMIN] Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg" className="py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-accent-800 mb-2">
              👨‍💼 Panel de Administrador
            </h1>
            <p className="text-accent-600">Gestiona la plataforma Almuerza Ya</p>
          </div>
          <Button variant="secondary" onClick={() => logout()}>
            Cerrar Sesión
          </Button>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="text-center">
                <p className="text-accent-600 text-sm font-medium mb-2">
                  Total Restaurantes
                </p>
                <p className="text-4xl font-bold text-primary-600">
                  {stats.totalRestaurants}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.activeRestaurants} activos
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <p className="text-accent-600 text-sm font-medium mb-2">
                  Total Usuarios
                </p>
                <p className="text-4xl font-bold text-blue-600">
                  {stats.totalUsers}
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <p className="text-accent-600 text-sm font-medium mb-2">
                  Ingresos Totales
                </p>
                <p className="text-4xl font-bold text-green-600">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <p className="text-accent-600 text-sm font-medium mb-2">
                  Tasa Actividad
                </p>
                <p className="text-4xl font-bold text-yellow-600">
                  {Math.round((stats.activeRestaurants / stats.totalRestaurants) * 100)}%
                </p>
              </div>
            </Card>
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-accent-800 mb-4">
              Gestión de Restaurantes
            </h3>
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => (window.location.href = '/admin/restaurants')}
            >
              📍 Ver Restaurantes
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-accent-800 mb-4">
              Gestión de Usuarios
            </h3>
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => (window.location.href = '/admin/users')}
            >
              👥 Ver Usuarios
            </Button>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default AdminDashboard;
