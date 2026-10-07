import { api } from './api';
import type { Wholesaler, Product } from '@/types';

export const wholesalerService = {
  async getWholesalers(): Promise<Wholesaler[]> {
    const res = await api.get('/wholesalers');
    return res.data.data || res.data;
  },

  async getWholesalerById(id: string): Promise<Wholesaler> {
    const res = await api.get(`/wholesalers/${id}`);
    return res.data.data || res.data;
  },

  async getWholesalerProducts(id: string): Promise<Product[]> {
    const res = await api.get(`/wholesalers/${id}/products`);
    return res.data.data || res.data;
  },

  async updateProfile(data: Partial<Wholesaler>): Promise<Wholesaler> {
    const res = await api.patch('/wholesalers/profile', data);
    return res.data.data || res.data;
  },
};
