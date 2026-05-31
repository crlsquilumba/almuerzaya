import api from './api';
import { ENDPOINTS } from '@config/constants';
import {
  LoginPayload,
  SignupPayload,
  AuthResponse,
  User,
} from '../types/entities.types';

class AuthService {
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    // Plataforma web es SOLO para RESTAURANT_OWNER
    const signupData = {
      ...payload,
      role: 'RESTAURANT_OWNER',
    };
    console.log('📝 [AUTH SERVICE] Signup payload:', { ...signupData, password: '***' });
    const response = await api.post<AuthResponse>(ENDPOINTS.SIGNUP, signupData);
    return response.data;
  }

  async signin(payload: LoginPayload): Promise<AuthResponse> {
    console.log('🌐 [AUTH SERVICE] Making POST request');
    console.log('🌐 [AUTH SERVICE] URL:', ENDPOINTS.SIGNIN);
    console.log('🌐 [AUTH SERVICE] Payload:', { email: payload.email, password: '***' });

    try {
      console.log('📡 [AUTH SERVICE] Sending request...');
      const response = await api.post<AuthResponse>(ENDPOINTS.SIGNIN, payload);

      console.log('📥 [AUTH SERVICE] Raw response received');
      console.log('📥 [AUTH SERVICE] Response status:', response.status);
      console.log('📥 [AUTH SERVICE] Response headers:', response.headers);
      console.log('📥 [AUTH SERVICE] Response data:', response.data);
      console.log('📥 [AUTH SERVICE] Token from response:', response.data.accessToken ? `${response.data.accessToken.substring(0, 20)}...` : 'NO TOKEN');

      return response.data;
    } catch (error) {
      console.error('❌ [AUTH SERVICE] signin() error');
      console.error('❌ [AUTH SERVICE] Error:', error);
      throw error;
    }
  }

  async me(): Promise<User> {
    const response = await api.get<User>(ENDPOINTS.ME);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post(ENDPOINTS.LOGOUT);
  }
}

export default new AuthService();
