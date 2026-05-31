import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import authService from '@services/auth.service';
import restaurantService from '@services/restaurant.service';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import { Alert } from '@components/ui/Alert';
import { isValidEmail } from '@utils/validators';

export const OnboardingRestaurant: React.FC = () => {
  const navigate = useNavigate();
  const { setToken, setUser, isAuthenticated } = useAuthStore();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    restaurantName: '',
    logo: null as File | null,
    phone: '',
    bankAccount: '',
    address: '',
    latitude: '',
    longitude: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'logo' && files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.restaurantName) newErrors.restaurantName = 'Nombre del restaurante requerido';
      if (!formData.logo) newErrors.logo = 'Logo/Foto del restaurante requerido';
      if (!formData.phone) newErrors.phone = 'Teléfono requerido';
      if (!formData.bankAccount) newErrors.bankAccount = 'Cuenta DeUna requerida';
    }

    if (step === 2) {
      if (!formData.address) newErrors.address = 'Dirección requerida';
      if (!formData.latitude) newErrors.latitude = 'Latitud requerida';
      if (!formData.longitude) newErrors.longitude = 'Longitud requerida';
    }

    if (step === 3) {
      if (!formData.firstName) newErrors.firstName = 'Nombre requerido';
      if (!formData.lastName) newErrors.lastName = 'Apellido requerido';
      if (!formData.email) newErrors.email = 'Email requerido';
      else if (!isValidEmail(formData.email)) newErrors.email = 'Email inválido (ej: usuario@dominio.com)';
      if (!formData.password) newErrors.password = 'Contraseña requerida';
      if (formData.password && formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmar contraseña requerida';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Sign up user (only if not already authenticated)
      if (!isAuthenticated) {
        console.log('📝 [ONBOARDING] Not authenticated, creating user account...');
        const signupResponse = await authService.signup({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          role: 'RESTAURANT_OWNER',
        });

        setToken(signupResponse.accessToken);
        setUser(signupResponse.user);
        console.log('✅ [ONBOARDING] User account created');
      } else {
        console.log('✅ [ONBOARDING] User already authenticated, skipping signup');
      }

      // Step 2: Create restaurant (logo upload can be done separately from dashboard)
      const restaurantData = {
        name: formData.restaurantName,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        phone: formData.phone,
        basePrice: 5.0,
        bankAccount: formData.bankAccount,
      };

      const createdRestaurant = await restaurantService.create(restaurantData);

      console.log('📦 [ONBOARDING] Full createdRestaurant response:', JSON.stringify(createdRestaurant, null, 2));
      console.log('📦 [ONBOARDING] createdRestaurant.id:', createdRestaurant?.id);
      console.log('📦 [ONBOARDING] typeof createdRestaurant:', typeof createdRestaurant);

      // Save restaurantId to localStorage for use in dashboard
      const restaurantId = createdRestaurant?.id;

      if (!restaurantId) {
        console.error('❌ [ONBOARDING] No restaurant ID received. Full response:', createdRestaurant);
        throw new Error(`No se recibió ID del restaurante. Respuesta: ${JSON.stringify(createdRestaurant)}`);
      }

      // Save restaurantId to localStorage SYNCHRONOUSLY
      try {
        localStorage.setItem('restaurantId', restaurantId);
        console.log('✅ [ONBOARDING] restaurantId set to localStorage:', restaurantId);
      } catch (storageErr) {
        console.error('❌ [ONBOARDING] Failed to save to localStorage:', storageErr);
        throw new Error('No se pudo guardar datos locales. Comprueba tu navegador.');
      }

      // Verify it was saved BEFORE navigating
      const savedId = localStorage.getItem('restaurantId');
      console.log('✅ [ONBOARDING] Verified restaurantId in localStorage:', savedId);

      if (!savedId) {
        throw new Error('No se pudo guardar el restaurantId en localStorage - localStorage vacío');
      }

      if (savedId !== restaurantId) {
        throw new Error(`restaurantId mismatch: saved="${savedId}" vs original="${restaurantId}"`);
      }

      // TODO: Upload logo to imageUrl after restaurant creation if logo exists
      // This would require a separate endpoint or multipart form data handling

      console.log('✅ [ONBOARDING] Cuenta y restaurante creados exitosamente. Ya estás autenticado.');
      console.log('🚀 [ONBOARDING] Navegando a /dashboard con restaurantId:', restaurantId);

      // Go to dashboard directly (already authenticated from signup)
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Error en el registro';
      setError(msg);
      console.error('❌ [ONBOARDING] Error:', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showBackButton={true} backPath="/landing" backLabel="← ATRÁS">
        {/* Progress Indicator Row */}
        <div className="mt-4 flex items-center justify-between gap-2">
            {[1, 2, 3].map((s, idx) => (
              <div key={s} className="flex items-center gap-1.5 flex-1">
                <div
                  className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center transition-all flex-shrink-0 ${
                    s === step
                      ? 'bg-red-600 text-white shadow-lg'
                      : s < step
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-wide whitespace-nowrap">
                  {['Restaurante', 'Ubicación', 'Propietario'][idx]}
                </span>
                {s < 3 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 ${
                      s < step ? 'bg-red-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
        </div>
      </Header>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gradient-to-b from-gray-50 to-white py-12">
        <Container maxWidth="4xl">
          <div className="max-w-4xl mx-auto">

            {/* Form Card */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg">
              {error && (
                <Alert variant="error" className="mb-8">
                  <span className="text-sm font-semibold">⚠️ {error}</span>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* STEP 1: Restaurant Info */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-4xl font-black text-gray-900 mb-1">CREAR RESTAURANTE</h2>
                      <p className="text-sm text-gray-600 font-medium">Datos básicos de tu local</p>
                    </div>

                    {/* Restaurant Name */}
                    <div>
                      <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">
                        NOMBRE RESTAURANTE
                      </label>
                      <input
                        type="text"
                        name="restaurantName"
                        value={formData.restaurantName}
                        onChange={handleChange}
                        placeholder="Ej: Asados & Picañas"
                        className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                          errors.restaurantName
                            ? 'border-red-600 bg-red-50'
                            : 'border-gray-200 bg-gray-50 focus:border-red-600'
                        }`}
                      />
                      {errors.restaurantName && (
                        <p className="text-xs text-red-600 font-bold mt-1">{errors.restaurantName}</p>
                      )}
                    </div>

                    {/* Logo Upload */}
                    <div>
                      <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">
                        LOGO / FOTO RESTAURANTE
                      </label>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            name="logo"
                            accept="image/*"
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                              errors.logo
                                ? 'border-red-600 bg-red-50'
                                : 'border-gray-200 bg-gray-50 focus:border-red-600'
                            }`}
                          />
                          {errors.logo && <p className="text-xs text-red-600 font-bold mt-1">{errors.logo}</p>}
                        </div>
                        {logoPreview && (
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                          />
                        )}
                      </div>
                    </div>

                    {/* Phone & Bank Account - 2 Columns */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">
                          TELÉFONO
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+593912345678"
                          className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                            errors.phone
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 bg-gray-50 focus:border-red-600'
                          }`}
                        />
                        {errors.phone && <p className="text-xs text-red-600 font-bold mt-1">{errors.phone}</p>}
                      </div>

                      {/* Bank Account */}
                      <div>
                        <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">
                          CUENTA DEUNA
                        </label>
                        <input
                          type="text"
                          name="bankAccount"
                          value={formData.bankAccount}
                          onChange={handleChange}
                          placeholder="1234567890"
                          className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                            errors.bankAccount
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 bg-gray-50 focus:border-red-600'
                          }`}
                        />
                        {errors.bankAccount && (
                          <p className="text-xs text-red-600 font-bold mt-1">{errors.bankAccount}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Location */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-4xl font-black text-gray-900 mb-1">UBICACIÓN</h2>
                      <p className="text-sm text-gray-600 font-medium">Dirección y coordenadas GPS de tu restaurante</p>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">
                        DIRECCIÓN
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Av. Principal 1234, Quito"
                        className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                          errors.address
                            ? 'border-red-600 bg-red-50'
                            : 'border-gray-200 bg-gray-50 focus:border-red-600'
                        }`}
                      />
                      {errors.address && <p className="text-xs text-red-600 font-bold mt-1">{errors.address}</p>}
                    </div>

                    {/* Latitude & Longitude */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">
                          LATITUD
                        </label>
                        <input
                          type="number"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleChange}
                          placeholder="-0.2189"
                          step="0.0001"
                          className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                            errors.latitude
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 bg-gray-50 focus:border-red-600'
                          }`}
                        />
                        {errors.latitude && (
                          <p className="text-xs text-red-600 font-bold mt-1">{errors.latitude}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">
                          LONGITUD
                        </label>
                        <input
                          type="number"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleChange}
                          placeholder="-78.4842"
                          step="0.0001"
                          className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                            errors.longitude
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 bg-gray-50 focus:border-red-600'
                          }`}
                        />
                        {errors.longitude && (
                          <p className="text-xs text-red-600 font-bold mt-1">{errors.longitude}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Owner & Auth Info */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-4xl font-black text-gray-900 mb-1">DATOS DEL PROPIETARIO</h2>
                      <p className="text-sm text-gray-600 font-medium">Crea tu usuario y contraseña de acceso</p>
                    </div>

                    {/* First Name & Last Name - 2 Columns */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* First Name */}
                      <div>
                        <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">
                          NOMBRE
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Carlos"
                          className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                            errors.firstName
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 bg-gray-50 focus:border-red-600'
                          }`}
                        />
                        {errors.firstName && (
                          <p className="text-xs text-red-600 font-bold mt-1">{errors.firstName}</p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">
                          APELLIDO
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Quilumba"
                          className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                            errors.lastName
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 bg-gray-50 focus:border-red-600'
                          }`}
                        />
                        {errors.lastName && (
                          <p className="text-xs text-red-600 font-bold mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contacto@restaurante.com"
                        className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                          errors.email
                            ? 'border-red-600 bg-red-50'
                            : 'border-gray-200 bg-gray-50 focus:border-red-600'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-600 font-bold mt-1">{errors.email}</p>}
                    </div>

                    {/* Password & Confirm - 2 Columns */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Password */}
                      <div>
                        <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">
                          CONTRASEÑA
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Mínimo 8 caracteres"
                          className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                            errors.password
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 bg-gray-50 focus:border-red-600'
                          }`}
                        />
                        {errors.password && <p className="text-xs text-red-600 font-bold mt-1">{errors.password}</p>}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">
                          REPETIR CONTRASEÑA
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirma tu contraseña"
                          className={`w-full px-4 py-3 border-2 rounded-xl text-sm font-semibold focus:outline-none transition-all ${
                            errors.confirmPassword
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 bg-gray-50 focus:border-red-600'
                          }`}
                        />
                        {errors.confirmPassword && (
                          <p className="text-xs text-red-600 font-bold mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-8 border-t border-gray-200">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 px-8 py-4 border-2 border-gray-900 text-gray-900 font-black text-base rounded-full transition-all transform hover:scale-105 hover:bg-gray-900 hover:text-white"
                    >
                      ← ATRÁS
                    </button>
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-base rounded-full transition-all transform hover:scale-105 shadow-lg"
                    >
                      SIGUIENTE →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-black text-base rounded-full transition-all transform hover:scale-105 shadow-lg"
                    >
                      {isLoading ? '⏳ CREANDO CUENTA...' : '✓ CREAR CUENTA'}
                    </button>
                  )}
                </div>
              </form>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 font-semibold mt-8">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-red-600 font-black hover:underline"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <Container maxWidth="4xl">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-gray-300">
              MicLabs Tech © 2026 • Inteligencia Operativa para Negocios Locales
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default OnboardingRestaurant;
