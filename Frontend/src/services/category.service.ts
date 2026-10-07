import { api } from './api';
import type { ProductCategory } from '@/types';

export const categoryService = {
  async getCategories(): Promise<ProductCategory[]> {
    const res = await api.get('/categories');
    return res.data.data || res.data;
  },

  async createCategory(data: { name: string; description?: string; icon?: string }): Promise<ProductCategory> {
    const res = await api.post('/categories', data);
    return res.data.data || res.data;
  },

  async updateCategory(id: string, data: { name?: string; description?: string; icon?: string }): Promise<ProductCategory> {
    const res = await api.patch(`/categories/${id}`, data);
    return res.data.data || res.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
