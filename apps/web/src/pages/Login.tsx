import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { Header } from '@components/layout/Header';
import { Alert } from '@components/ui/Alert';
import { isValidEmail } from '@utils/validators';
import restaurantService from '@services/restaurant.service';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    setGeneralError(null);
  };

  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email es requerido';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneralError(null);

    try {
      console.log('🔐 [LOGIN] Iniciando login...');
      await login(formData.email, formData.password);
      console.log('✅ [LOGIN] Login exitoso');

      // Check if user has restaurantId in localStorage
      let restaurantId = localStorage.getItem('restaurantId');
      console.log('🔍 [LOGIN] Checking restaurantId in localStorage:', restaurantId);

      // If no restaurantId in localStorage, try to fetch from backend
      if (!restaurantId) {
        console.log('⚠️ [LOGIN] No restaurantId in localStorage, fetching from backend...');
        try {
          const restaurant = await restaurantService.getMyRestaurant();
          if (restaurant?.id) {
            restaurantId = restaurant.id;
            localStorage.setItem('restaurantId', restaurantId);
            console.log('✅ [LOGIN] restaurantId retrieved from backend and saved:', restaurantId);
          }
        } catch (fetchErr) {
          console.log('ℹ️ [LOGIN] No restaurant found for user, will redirect to onboarding');
        }
      }

      if (!restaurantId) {
        console.log('⚠️ [LOGIN] No restaurantId found, redirecting to onboarding');
        navigate('/onboarding', { replace: true });
      } else {
        console.log('✅ [LOGIN] restaurantId found, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      console.error('❌ [LOGIN] Error:', err);
      const msg = err?.response?.data?.message || 'Email o contraseña incorrectos';
      setGeneralError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implementar Google SSO con Google Identity (gsi)
    console.log('🔵 [LOGIN] Google SSO - Por implementar');
    alert('Google SSO - Próximamente');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showBackButton={true} backPath="/landing" backLabel="← ATRÁS" />

      {/* Login Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-gray-900">INICIAR SESIÓN</h2>
            <p className="text-sm text-gray-600 font-medium">Accede a tu dashboard de restaurante</p>
          </div>

          {/* Error Alert */}
          {generalError && (
            <Alert variant="error" className="mb-4">
              <span className="text-sm font-semibold">⚠️ {generalError}</span>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-900 uppercase tracking-wider">
                Email o Usuario
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@restaurante.com"
                disabled={isLoading}
                className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                  errors.email
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 bg-gray-50 focus:border-red-600'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 font-bold">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-900 uppercase tracking-wider">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                  errors.password
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 bg-gray-50 focus:border-red-600'
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-600 font-bold">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-black text-base rounded-full transition-all transform hover:scale-105 shadow-lg mt-2"
            >
              {isLoading ? '⏳ INICIANDO SESIÓN...' : '→ INICIAR SESIÓN'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs font-semibold text-gray-500 uppercase">O</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full px-6 py-4 bg-white border-2 border-gray-300 hover:border-gray-400 disabled:bg-gray-100 text-gray-900 font-black text-base rounded-full transition-all flex items-center justify-center gap-3 shadow-sm"
          >
            <span className="text-xl">🔵</span>
            CONTINUAR CON GOOGLE
          </button>

          {/* Footer Links */}
          <div className="space-y-3 text-center">
            <div>
              <p className="text-sm text-gray-700 font-medium">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => navigate('/onboarding')}
                  className="text-red-600 font-black hover:underline"
                >
                  REGISTRA TU RESTAURANTE
                </button>
              </p>
            </div>
            <div>
              <button className="text-xs text-gray-500 font-semibold hover:text-gray-700">
                ¿OLVIDASTE TU CONTRASEÑA?
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-xs text-gray-500 font-semibold py-8">
        <p>MicLabs Tech © 2026</p>
      </div>
    </div>
  );
};

export default Login;
