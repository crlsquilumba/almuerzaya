import React from 'react';
import { Container } from './Container';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent-800 text-white py-8">
      <Container maxWidth="2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-2">Almuerza Ya</h3>
            <p className="text-secondary-300 text-sm">
              Plataforma de reservación de almuerzos ejecutivos con entrega rápida.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-3 text-sm">Productos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  Restaurantes
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  Reservaciones
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  Pagos
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-3 text-sm">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  Acerca de
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  Términos
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-300 text-sm">
              © {currentYear} Almuerza Ya. Todos los derechos reservados.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-secondary-300 hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V15.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-secondary-300 hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20v-7.21H5.5V9.25h2.79V7.07c0-2.766 1.686-4.27 4.154-4.27 1.185 0 2.203.088 2.499.128v2.894h-1.717c-1.346 0-1.607.64-1.607 1.577V9.25h3.213l-.418 3.54h-2.795V20h-3.408z" />
                </svg>
              </a>
              <a href="#" className="text-secondary-300 hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 1.5v5.3h-2.6V4.5h2.6m-6.3 8.8h2.6v6.3h-2.6v-6.3m-4.5-1.8A1.5 1.5 0 0 1 8 13.2a1.5 1.5 0 0 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

Footer.displayName = 'Footer';
