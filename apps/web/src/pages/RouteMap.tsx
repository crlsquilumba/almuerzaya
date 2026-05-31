import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { Container } from '@components/layout/Container';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';

export const RouteMap: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const routes = [
    {
      path: '/',
      name: 'Home / Dashboard',
      description: 'Página principal - Muestra dashboard según rol',
      public: true,
      roles: ['CUSTOMER', 'RESTAURANT_OWNER', 'ADMIN'],
    },
    {
      path: '/login',
      name: 'Login',
      description: 'Iniciar sesión',
      public: true,
      roles: [],
    },
    {
      path: '/onboarding',
      name: 'Registrar Restaurante',
      description: 'Formulario de registro en 3 pasos',
      public: true,
      roles: [],
    },
    {
      path: '/restaurant-dashboard',
      name: 'Dashboard de Restaurante',
      description: 'Panel principal del restaurante',
      public: false,
      roles: ['RESTAURANT_OWNER'],
    },
    {
      path: '/dashboard',
      name: 'Dashboard (Alternativo)',
      description: 'Mismo que /restaurant-dashboard',
      public: false,
      roles: ['RESTAURANT_OWNER'],
    },
    {
      path: '/menu',
      name: 'Gestión de Menú',
      description: 'Crear, editar, eliminar platos',
      public: false,
      roles: ['RESTAURANT_OWNER'],
    },
    {
      path: '/kitchen',
      name: 'Cocina en Vivo',
      description: 'Panel de órdenes en tiempo real',
      public: false,
      roles: ['RESTAURANT_OWNER'],
    },
    {
      path: '/admin',
      name: 'Panel Administrativo',
      description: 'Dashboard global de admin',
      public: false,
      roles: ['ADMIN'],
    },
    {
      path: '/admin/restaurants',
      name: 'Gestión de Restaurantes',
      description: 'Ver, aprobar, desactivar restaurantes',
      public: false,
      roles: ['ADMIN'],
    },
    {
      path: '/admin/users',
      name: 'Gestión de Usuarios',
      description: 'Administrar usuarios de la plataforma',
      public: false,
      roles: ['ADMIN'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-premium relative overflow-hidden py-16">
      <div className="absolute top-0 right-0 w-full h-96 bg-primary-600 opacity-10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-full h-96 bg-gastro-green opacity-10 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <Container maxWidth="4xl" className="relative z-10">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="font-display text-6xl font-bold text-gastro-charcoal">
              🗺️ Mapa de Rutas
            </h1>
            <p className="text-2xl text-accent-600">
              Todas las páginas y rutas de Almuerza Ya
            </p>
          </div>

          {/* User Info */}
          <Card className="p-8 border-l-4 border-primary-600">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-accent-600">USUARIO ACTUAL</p>
              <p className="text-2xl font-bold text-gastro-charcoal">
                {isAuthenticated ? (
                  <>
                    {user?.firstName} {user?.lastName} ({user?.role})
                  </>
                ) : (
                  'No autenticado'
                )}
              </p>
              {isAuthenticated && (
                <p className="text-sm text-accent-600 mt-4">
                  Email: {user?.email}
                </p>
              )}
            </div>
          </Card>

          {/* Routes List */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gastro-charcoal mb-8">
              {isAuthenticated ? '🔐 Rutas Protegidas & Públicas' : '🔓 Rutas Públicas'}
            </h2>

            <div className="grid gap-4">
              {routes.map((route, idx) => {
                const canAccess =
                  route.public ||
                  (isAuthenticated && route.roles.includes(user?.role || ''));

                return (
                  <Card
                    key={idx}
                    className={`p-6 border-l-4 transition-all hover:shadow-lg ${
                      canAccess
                        ? 'border-success-600 bg-success-50'
                        : 'border-error-600 bg-error-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <code className="text-lg font-bold text-primary-600 bg-white px-3 py-1 rounded">
                            {route.path}
                          </code>
                          {canAccess ? (
                            <span className="px-3 py-1 bg-success-600 text-white text-sm font-bold rounded-full">
                              ✓ Accesible
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-error-600 text-white text-sm font-bold rounded-full">
                              ✗ Bloqueado
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-gastro-charcoal mb-2">
                          {route.name}
                        </h3>
                        <p className="text-lg text-accent-600 mb-3">
                          {route.description}
                        </p>
                        {route.roles.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {route.roles.map((role) => (
                              <span
                                key={role}
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  user?.role === role
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-secondary-200 text-accent-700'
                                }`}
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => navigate(route.path)}
                        disabled={!canAccess}
                        className="whitespace-nowrap"
                      >
                        Ir →
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Info Card */}
          <Card className="p-8 bg-info-50 border-l-4 border-info-600">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-info-700">ℹ️ Información</h3>
              <ul className="space-y-2 text-lg text-info-600 list-disc pl-6">
                <li>Todas las rutas se pueden acceder desde la barra de direcciones</li>
                <li>Las rutas protegidas requieren autenticación y rol específico</li>
                <li>Si intentas acceder a una ruta bloqueada, serás redirigido a /login</li>
                <li>La URL siempre muestra dónde estás en la aplicación</li>
              </ul>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default RouteMap;
