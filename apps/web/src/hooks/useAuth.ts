import { useEffect } from 'react';
import { useAuthStore } from '@store/authStore';

export const useAuth = () => {
  const { token, user, isAuthenticated, isLoading, login, signup, logout, checkAuth } =
    useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };
};
