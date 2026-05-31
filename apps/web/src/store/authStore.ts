import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '@services/auth.service';
import { User } from '../types/entities.types';
import { AuthState } from '../types/store.types';
import { AUTH_TOKEN_KEY, USER_KEY } from '@config/constants';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('📡 [AUTH STORE] Calling authService.signin()');
          console.log(`📡 [AUTH STORE] Email: ${email}, Password: ***`);

          const response = await authService.signin({ email, password });

          console.log('📦 [AUTH STORE] Backend response received');
          console.log('📦 [AUTH STORE] Full response:', response);
          console.log('🔑 [AUTH STORE] AccessToken received:', response.accessToken ? `Yes (${response.accessToken.substring(0, 20)}...)` : 'NO');
          console.log('👤 [AUTH STORE] User data:', response.user);

          set({
            token: response.accessToken,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log('💾 [AUTH STORE] Setting token in localStorage...');
          localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);

          console.log('💾 [AUTH STORE] Setting user in localStorage...');
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));

          console.log('✅ [AUTH STORE] Both token and user saved to localStorage');
          console.log('✅ [AUTH STORE] Verifying localStorage...');
          console.log(`✅ [AUTH STORE] Token in localStorage: ${localStorage.getItem(AUTH_TOKEN_KEY) ? 'YES' : 'NO'}`);
          console.log(`✅ [AUTH STORE] User in localStorage: ${localStorage.getItem(USER_KEY) ? 'YES' : 'NO'}`);

        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message || 'Login failed. Please try again.';
          console.error('❌ [AUTH STORE] Login error:', errorMessage);
          console.error('❌ [AUTH STORE] Full error object:', error);
          console.error('❌ [AUTH STORE] Error response data:', error?.response?.data);
          console.error('❌ [AUTH STORE] Error status:', error?.response?.status);
          console.error('❌ [AUTH STORE] Error message:', error?.message);
          console.error('❌ [AUTH STORE] Error stack:', error?.stack);

          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      signup: async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phone: string
      ) => {
        set({ isLoading: true, error: null });
        try {
          console.log('📝 [AUTH STORE] Calling authService.signup()');
          const response = await authService.signup({
            email,
            password,
            firstName,
            lastName,
            phone,
          });

          console.log('📦 [AUTH STORE] Signup response received:', response);
          console.log('🔑 [AUTH STORE] AccessToken:', response.accessToken ? `Yes (${response.accessToken.substring(0, 20)}...)` : 'NO');
          console.log('👤 [AUTH STORE] User:', response.user);

          set({
            token: response.accessToken,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));

          console.log('✅ [AUTH STORE] Signup successful');
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message || 'Signup failed. Please try again.';
          console.error('❌ [AUTH STORE] Signup error:', errorMessage);
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        console.log('🚪 [AUTH STORE] Logging out...');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
        console.log('🧹 [AUTH STORE] Clearing localStorage...');
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        // ✅ NO borrar restaurantId - el restaurante sigue existiendo en la BD
        console.log('✅ [AUTH STORE] Session data cleared (restaurantId persisted)');
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const token = localStorage.getItem(AUTH_TOKEN_KEY);
          if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return;
          }

          const user = await authService.me();
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      },

      setToken: (token: string | null) => {
        set({ token });
        if (token) {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
        } else {
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      },

      setUser: (user: User | null) => {
        set({ user });
        if (user) {
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(USER_KEY);
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
