import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

export interface DashboardNavItem {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

interface HeaderProps {
  showLoginButton?: boolean;
  showBackButton?: boolean;
  backPath?: string;
  backLabel?: string;
  dashboardNav?: DashboardNavItem[];
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  showLoginButton = false,
  showBackButton = false,
  backPath = '/landing',
  backLabel = '← ATRÁS',
  dashboardNav,
  children,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
        <div className="flex items-center justify-between mb-0">
          {/* Logo */}
          <button
            onClick={() => navigate('/landing')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-4xl">🍽️</span>
            <div>
              <h1 className="text-2xl font-black text-red-600 leading-none">ALMUERZA YA</h1>
              <p className="text-xs text-gray-600 font-semibold tracking-wider">GESTIÓN DE RESTAURANTE</p>
            </div>
          </button>

          {/* Center - Dashboard Navigation */}
          {dashboardNav && dashboardNav.length > 0 && (
            <nav className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 gap-1">
              {dashboardNav.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`px-3 py-2 rounded-md text-xs font-black uppercase tracking-wider transition ${
                    item.isActive
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={() => navigate(backPath)}
                className="px-6 py-3 text-gray-900 font-black text-sm rounded-full transition-all hover:bg-gray-100"
              >
                {backLabel}
              </button>
            )}

            {showLoginButton && !isAuthenticated && (
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-full transition-all transform hover:scale-105 shadow-md"
              >
                INICIAR SESIÓN
              </button>
            )}

            {/* User Profile Dropdown */}
            {isAuthenticated && user && (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-100 transition-all"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-sm">
                    {user.firstName?.charAt(0).toUpperCase()}
                  </div>
                  {/* Name */}
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-black text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] text-gray-500 font-semibold">
                      {user.role === 'RESTAURANT_OWNER' ? 'Propietario' : user.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                    </p>
                  </div>
                  {/* Chevron */}
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
                    {/* User Info */}
                    <div className="px-4 py-4 border-b border-gray-100">
                      <p className="text-xs font-black text-gray-600 uppercase tracking-wider">Perfil</p>
                      <p className="text-sm font-black text-gray-900 mt-1">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">{user.email}</p>
                      {user.role === 'RESTAURANT_OWNER' && (
                        <p className="text-xs text-red-600 font-bold mt-2">🍽️ Propietario de Restaurante</p>
                      )}
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                        navigate('/landing', { replace: true });
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-black text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 rounded-b-xl"
                    >
                      <span>🚪</span>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Children (additional content like progress indicators) */}
        {children}
      </div>
    </header>
  );
};

export default Header;
