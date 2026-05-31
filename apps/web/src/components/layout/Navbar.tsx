import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useCart } from '@hooks/useCart';
import { Button } from '../ui/Button';
import { Container } from './Container';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-secondary-200 sticky top-0 z-40">
      <Container maxWidth="2xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 text-white rounded-lg px-2 py-1 font-bold">
              AY
            </div>
            <span className="text-xl font-bold text-accent-800">Almuerza Ya</span>
          </Link>

          {/* Menu - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/restaurants" className="text-accent-700 hover:text-primary-600">
                  Restaurantes
                </Link>
                <Link to="/orders" className="text-accent-700 hover:text-primary-600">
                  Mis órdenes
                </Link>
                <Link to="/profile" className="text-accent-700 hover:text-primary-600">
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-accent-700 hover:text-primary-600"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Ingresar
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          {/* Cart Icon */}
          {isAuthenticated && (
            <Link to="/checkout" className="relative mr-4">
              <button className="text-accent-800 hover:text-primary-600 transition-colors">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-accent-800"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-secondary-200">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  to="/restaurants"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-accent-700 hover:text-primary-600 px-4 py-2"
                >
                  Restaurantes
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-accent-700 hover:text-primary-600 px-4 py-2"
                >
                  Mis órdenes
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-accent-700 hover:text-primary-600 px-4 py-2"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-accent-700 hover:text-primary-600 px-4 py-2 text-left"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Ingresar
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </Container>
    </nav>
  );
};

Navbar.displayName = 'Navbar';
