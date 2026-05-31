import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { Spinner } from '@components/ui/Spinner';

// Pages - Public
const Home = React.lazy(() => import('@pages/Home').then((m) => ({ default: m.Home })));
const Login = React.lazy(() => import('@pages/Login').then((m) => ({ default: m.Login })));
const OnboardingRestaurant = React.lazy(() => import('@pages/OnboardingRestaurant').then((m) => ({ default: m.OnboardingRestaurant })));

// Pages - Restaurant Dashboard
const RestaurantDashboard = React.lazy(() => import('@pages/RestaurantDashboard').then((m) => ({ default: m.RestaurantDashboard })));
const MenuManagement = React.lazy(() => import('@pages/MenuManagement').then((m) => ({ default: m.MenuManagement })));
const KitchenDashboard = React.lazy(() => import('@pages/KitchenDashboard').then((m) => ({ default: m.KitchenDashboard })));
const ReservationDetail = React.lazy(() => import('@pages/ReservationDetail').then((m) => ({ default: m.ReservationDetail })));

// Pages - Admin
const AdminDashboard = React.lazy(() => import('@pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminRestaurants = React.lazy(() => import('@pages/AdminRestaurants').then((m) => ({ default: m.AdminRestaurants })));
const AdminUsers = React.lazy(() => import('@pages/AdminUsers').then((m) => ({ default: m.AdminUsers })));

// Protected Route Component
interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: 'RESTAURANT_OWNER' | 'ADMIN';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.warn(`⚠️ Access denied. Required role: ${requiredRole}, User role: ${user?.role}`);
    return <Navigate to="/login" replace />;
  }

  return element;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Spinner size="lg" />
          </div>
        }
      >
        <Routes>
          {/* Landing Page */}
          <Route path="/landing" element={<Home />} />

          {/* Root - Redirect to landing */}
          <Route path="/" element={<Navigate to="/landing" replace />} />

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/landing" replace /> : <Login />
            }
          />
          {/* Onboarding - Accessible to both authenticated and non-authenticated users */}
          {/* But primarily for restaurant owners who just signed up */}
          <Route
            path="/onboarding"
            element={<OnboardingRestaurant />}
          />

          {/* Restaurant Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                element={<RestaurantDashboard />}
                requiredRole="RESTAURANT_OWNER"
              />
            }
          />
          <Route
            path="/restaurant-dashboard"
            element={
              <ProtectedRoute
                element={<RestaurantDashboard />}
                requiredRole="RESTAURANT_OWNER"
              />
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute
                element={<MenuManagement />}
                requiredRole="RESTAURANT_OWNER"
              />
            }
          />
          <Route
            path="/kitchen"
            element={
              <ProtectedRoute
                element={<KitchenDashboard />}
                requiredRole="RESTAURANT_OWNER"
              />
            }
          />
          <Route
            path="/reservations/:id"
            element={
              <ProtectedRoute
                element={<ReservationDetail />}
                requiredRole="RESTAURANT_OWNER"
              />
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                requiredRole="ADMIN"
              />
            }
          />
          <Route
            path="/admin/restaurants"
            element={
              <ProtectedRoute
                element={<AdminRestaurants />}
                requiredRole="ADMIN"
              />
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute
                element={<AdminUsers />}
                requiredRole="ADMIN"
              />
            }
          />

          {/* 404 - Redirige a home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default App;
