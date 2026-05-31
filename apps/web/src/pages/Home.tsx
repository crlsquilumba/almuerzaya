import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import restaurantService from '@services/restaurant.service';
import { Restaurant } from '../types/entities.types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if RESTAURANT_OWNER
  useEffect(() => {
    if (isAuthenticated && user?.role === 'RESTAURANT_OWNER') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch restaurants when landing page loads
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const data = await restaurantService.getAll();
        // Handle both formats: direct array or paginated response
        const restaurantsList = Array.isArray(data) ? data : (data?.data || []);
        setRestaurants(restaurantsList);
      } catch (error) {
        console.error('❌ Error fetching restaurants:', error);
        setRestaurants([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthenticated) {
      fetchRestaurants();
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showLoginButton={true} />

      {/* HERO SECTION */}
      <section className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <Container maxWidth="4xl" className="py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-10">
              {/* Headline */}
              <div className="space-y-6">
                <div>
                  <p className="text-red-600 font-black text-sm tracking-widest uppercase mb-3">
                    Bienvenido a
                  </p>
                  <h2 className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
                    ALMUERZA YA
                  </h2>
                </div>
                <div className="space-y-4 text-gray-700 font-medium leading-relaxed max-w-lg">
                  <p className="text-xl">
                    <span className="font-black text-red-600">Digitaliza tu menú diario en 3 clics.</span>
                  </p>
                  <p className="text-lg">
                    Atrae clientes locales en un radio de 5km de forma automática. Sincroniza tu cocina con las mesas físicas usando algoritmos matemáticos de geolocalización en tiempo real.
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate('/onboarding')}
                  className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-base rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  🚀 REGISTRAR RESTAURANTE
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-10 py-4 border-3 border-gray-900 text-gray-900 font-black text-base rounded-full transition-all transform hover:scale-105 hover:bg-gray-900 hover:text-white"
                >
                  YA TENGO CUENTA
                </button>
              </div>

              {/* Trust Stats */}
              <div className="flex gap-8 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-4xl font-black text-red-600">50+</p>
                  <p className="text-sm text-gray-600 font-semibold">Restaurantes Activos</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-red-600">24/7</p>
                  <p className="text-sm text-gray-600 font-semibold">Disponibilidad</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-red-600">4.8★</p>
                  <p className="text-sm text-gray-600 font-semibold">Rating Promedio</p>
                </div>
              </div>
            </div>

            {/* Right Visual - Feature Cards */}
            <div className="relative h-full">
              <div className="space-y-4">
                {/* Card 1 - Kanban */}
                <div className="bg-white border-2 border-red-600 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className="text-4xl mb-2">📋</div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">TABLERO KANBAN</h3>
                  <p className="text-xs text-gray-600 font-medium">Gestiona tus pedidos en tiempo real</p>
                </div>

                {/* Card 2 - Menu */}
                <div className="bg-white border-2 border-red-600 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className="text-4xl mb-2">📝</div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">GESTIÓN DE MENÚ</h3>
                  <p className="text-xs text-gray-600 font-medium">Actualiza tu menú diario al instante</p>
                </div>

                {/* Card 3 - Analytics */}
                <div className="bg-white border-2 border-red-600 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className="text-4xl mb-2">📊</div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">ANÁLISIS EN VIVO</h3>
                  <p className="text-xs text-gray-600 font-medium">Estadísticas en tiempo real</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* RESTAURANTS SECTION */}
      <section className="bg-gray-50 py-20 border-t border-gray-200">
        <Container maxWidth="4xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">RESTAURANTES DISPONIBLES</h2>
            <p className="text-xl text-gray-600 font-medium">Descubre los locales que ya confían en Almuerza Ya</p>
          </div>

          {isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(10)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-3 animate-pulse"
                >
                  <div className="w-24 h-24 bg-gray-300 rounded-xl"></div>
                  <div className="w-20 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : restaurants.length > 0 ? (
            // Restaurant Grid
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="flex flex-col items-center gap-4 group cursor-pointer"
                  onClick={() => console.log(`Ver restaurante: ${restaurant.name}`)}
                >
                  {/* Logo/Image Container */}
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-white border-3 border-gray-100 shadow-lg group-hover:shadow-2xl group-hover:border-red-600 transition-all transform group-hover:scale-105 duration-300">
                    {restaurant.image || restaurant.imageUrl ? (
                      <img
                        src={restaurant.image || restaurant.imageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white">
                        <span className="text-5xl">🍽️</span>
                      </div>
                    )}
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  </div>

                  {/* Restaurant Name */}
                  <div className="text-center w-full">
                    <p className="text-sm font-black text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                      {restaurant.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🥡</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Aún no hay restaurantes</h3>
              <p className="text-lg text-gray-600 mb-8">
                Sé el primero en registrar tu restaurante y llega a más clientes
              </p>
              <button
                onClick={() => navigate('/onboarding')}
                className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-base rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                🚀 REGISTRAR RESTAURANTE
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-red-600 py-20">
        <Container maxWidth="4xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4">¿POR QUÉ ELEGIR ALMUERZA YA?</h2>
            <p className="text-xl text-red-100 font-medium">Todo lo que necesitas para digitalizar tu restaurante</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: 'ULTRA RÁPIDO', desc: 'Sistema cloud que funciona sin interrupciones' },
              { icon: '🔒', title: 'SEGURO', desc: 'Datos protegidos con encriptación profesional' },
              { icon: '📱', title: 'INTUITIVO', desc: 'Interfaz diseñada para restauranteros' },
              { icon: '🌍', title: 'EN LÍNEA', desc: 'Accede desde cualquier dispositivo, en cualquier lugar' },
              { icon: '💰', title: 'COSTO EFECTIVO', desc: 'Planes flexibles para cualquier tamaño' },
              { icon: '🚀', title: 'ESCALABLE', desc: 'Crece sin límites con tu negocio' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-red-700 rounded-2xl p-8 text-white hover:bg-red-800 transition-all transform hover:-translate-y-2">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-black mb-3">{feature.title}</h3>
                <p className="text-red-100 font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA SECTION */}
      <section className="bg-white py-20 border-t border-gray-100">
        <Container maxWidth="4xl">
          <div className="text-center space-y-10">
            <div>
              <h2 className="text-5xl font-black text-gray-900 mb-4">COMIENZA HOY</h2>
              <p className="text-xl text-gray-600 font-medium">
                Únete a cientos de restaurantes que ya están optimizando su operación
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <button
                onClick={() => navigate('/onboarding')}
                className="px-12 py-5 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                CREAR CUENTA GRATIS
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-12 py-5 border-3 border-red-600 text-red-600 font-black text-lg rounded-full transition-all transform hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                YA TENGO CUENTA
              </button>
            </div>

            <p className="text-sm text-gray-500 font-semibold">
              Sin tarjeta de crédito requerida. Acceso inmediato al dashboard
            </p>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <Container maxWidth="4xl">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🍽️</span>
              <p className="font-black text-white">ALMUERZA YA</p>
            </div>
            <p className="text-sm font-medium text-gray-300">
              MicLabs Tech © 2026 • Inteligencia Operativa para Negocios Locales
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
