import { api } from './api';
import type { User } from '@/types';

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: 'SUPER_ADMIN' | 'WHOLESALER' | 'RETAILER';
  storeName?: string;
  storeAddress?: string;
  companyName?: string;
  businessAddress?: string;
  province?: string;
  district?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const res = await api.post('/auth/register', payload);
    return res.data.data || res.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const res = await api.post('/auth/login', payload);
    return res.data.data || res.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore errors on logout
    }
  },

  async getMe(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data.data || res.data;
  },
};
