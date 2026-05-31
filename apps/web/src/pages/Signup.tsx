import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { Container } from '@components/layout/Container';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Alert } from '@components/ui/Alert';
import { isValidEmail, isValidPhone, validatePassword, validateName } from '@utils/validators';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  };

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    const firstNameError = validateName(formData.firstName);
    if (firstNameError) {
      newErrors.firstName = firstNameError;
      isValid = false;
    }

    const lastNameError = validateName(formData.lastName);
    if (lastNameError) {
      newErrors.lastName = lastNameError;
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email es requerido';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Teléfono inválido';
      isValid = false;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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

    try {
      await signup(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone
      );
      navigate('/');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[a-z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;

    return {
      strength,
      label: strength < 50 ? 'Débil' : strength < 75 ? 'Regular' : 'Fuerte',
      color: strength < 50 ? 'bg-error-400' : strength < 75 ? 'bg-warning-400' : 'bg-success-400',
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-premium relative overflow-hidden flex items-center justify-center">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 opacity-20 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gastro-green opacity-15 rounded-full blur-3xl -ml-48 -mb-48"></div>
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-success-600 opacity-10 rounded-full blur-3xl"></div>

      <Container maxWidth="4xl" className="py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start min-h-[700px]">
          {/* Left: Form Section */}
          <div className="animate-fade-in">
            <div className="space-y-10">
              {/* Header */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 mb-2">
                  <span className="text-5xl">🚀</span>
                </div>
                <h1 className="font-display text-6xl font-bold text-gastro-charcoal leading-tight">
                  Crear Cuenta
                </h1>
                <p className="text-2xl text-accent-700 font-medium">
                  Únete a Almuerza Ya hoy
                </p>
                <div className="h-2 w-32 bg-gradient-accent rounded-full"></div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="error" closable className="animate-slide-up">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <p className="font-semibold text-lg">{error}</p>
                  </div>
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Nombre"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    placeholder="Juan"
                    icon="👤"
                    variant="outlined"
                    required
                  />
                  <Input
                    label="Apellido"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    placeholder="Pérez"
                    icon="👤"
                    variant="outlined"
                    required
                  />
                </div>

                {/* Email */}
                <Input
                  label="Correo Electrónico"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="usuario@restaurante.com"
                  icon="✉️"
                  variant="outlined"
                  required
                />

                {/* Phone */}
                <Input
                  label="Teléfono (opcional)"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="+593 98 765 4321"
                  icon="📱"
                  variant="outlined"
                />

                {/* Password */}
                <div className="relative">
                  <Input
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="••••••••"
                    icon="🔒"
                    variant="outlined"
                    required
                    helperText="Mínimo 8 caracteres, mayúscula, minúscula y número"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-14 text-accent-600 hover:text-accent-800 transition-colors text-xl"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="space-y-3 bg-secondary-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-accent-700">Fortaleza:</span>
                      <span
                        className={`font-bold text-lg ${
                          passwordStrength.strength < 50
                            ? 'text-error-600'
                            : passwordStrength.strength < 75
                            ? 'text-warning-600'
                            : 'text-success-600'
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-3 bg-secondary-300 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Confirm Password */}
                <div className="relative">
                  <Input
                    label="Confirmar Contraseña"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="••••••••"
                    icon="🔒"
                    variant="outlined"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-14 text-accent-600 hover:text-accent-800 transition-colors text-xl"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="xl"
                  isLoading={isLoading}
                  className="w-full font-bold text-xl"
                >
                  {isLoading ? 'Creando cuenta...' : '✨ Registrarse Ahora'}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-secondary-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-premium text-accent-700 font-medium">
                    ¿Ya tienes cuenta?
                  </span>
                </div>
              </div>

              {/* Footer Links */}
              <div className="space-y-4 text-center">
                <Link
                  to="/login"
                  className="block px-6 py-4 border-3 border-primary-600 text-primary-600 font-bold text-lg rounded-lg hover:bg-primary-50 transition-all transform hover:scale-105"
                >
                  🔐 Iniciar Sesión
                </Link>
                <Link
                  to="/"
                  className="inline-block text-base text-accent-600 hover:text-accent-800 transition-colors font-medium"
                >
                  ← Volver al inicio
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Visual Section */}
          <div className="hidden lg:flex items-center justify-center relative h-full animate-slide-up">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-success-600 to-success-700 rounded-3xl transform -rotate-3 opacity-20 shadow-xl"></div>
              <div className="absolute inset-0 bg-white rounded-3xl transform rotate-2 shadow-2xl p-16 flex flex-col justify-center items-center space-y-8">
                <div className="text-8xl animate-bounce" style={{ animationDuration: '2s' }}>
                  🚀
                </div>

                <div className="space-y-4 text-center">
                  <h2 className="font-display text-5xl font-bold text-gastro-charcoal">
                    Empieza Hoy
                  </h2>
                  <p className="text-lg text-accent-700 max-w-sm">
                    Únete a los mejores restaurantes del país en Almuerza Ya
                  </p>
                </div>

                <div className="w-full h-2 bg-gradient-accent rounded-full"></div>

                <div className="space-y-4 w-full pt-4">
                  {[
                    { icon: '⚡', title: 'Rápido', desc: 'Setup en minutos' },
                    { icon: '📊', title: 'Datos', desc: 'Analytics en vivo' },
                    { icon: '👥', title: 'Clientes', desc: 'Gestión integral' },
                    { icon: '💳', title: 'Pagos', desc: 'Automáticos y seguros' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-5 bg-gradient-to-r from-success-50 to-primary-50 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{item.icon}</span>
                        <div className="text-left">
                          <p className="font-bold text-primary-700 text-lg">{item.title}</p>
                          <p className="text-sm text-accent-600">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 space-y-2 text-center text-sm text-accent-600 font-semibold w-full">
                  <p>✅ Seguridad garantizada</p>
                  <p>✅ Soporte 24/7</p>
                  <p>✅ Actualizaciones gratis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Signup;
