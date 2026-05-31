import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_URL, AUTH_TOKEN_KEY } from '@config/constants';

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    console.log(`🔐 [API DEBUG] Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`🔐 [API DEBUG] Token from localStorage: ${token ? `${token.substring(0, 20)}...${token.substring(token.length - 10)}` : 'NOT FOUND'}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 [API DEBUG] Authorization header set: Bearer ${token.substring(0, 20)}...`);
    } else {
      console.warn(`⚠️ [API DEBUG] No token found! Token key checked: "${AUTH_TOKEN_KEY}"`);
    }

    console.log(`🔐 [API DEBUG] Full headers:`, config.headers);
    return config;
  },
  (error) => {
    console.error('❌ [API DEBUG] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and token expiration
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [API DEBUG] Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log(`✅ [API DEBUG] Response data:`, response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error(`❌ [API DEBUG] API Error:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      console.warn('⚠️ [API DEBUG] 401 Unauthorized - clearing token and redirecting to login');
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('❌ [API DEBUG] 403 Forbidden - user does not have permission');
    }

    if (error.response?.status === 500) {
      // Server error
      console.error('❌ [API DEBUG] 500 Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
