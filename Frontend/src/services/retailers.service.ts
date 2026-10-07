import { api } from './api';
import type { Retailer } from '@/types';

export const retailersService = {
  async updateProfile(data: Partial<Retailer>): Promise<Retailer> {
    const res = await api.patch('/retailers/profile', data);
    return res.data.data || res.data;
  },
};
