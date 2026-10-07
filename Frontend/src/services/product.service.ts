import { api } from './api';
import type { Product, PaginationMeta, ProductType } from '@/types';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  productType?: ProductType;
  wholesalerId?: string;
  available?: boolean;
}

export interface PaginatedProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

export const productService = {
  async getProducts(params?: ProductQueryParams): Promise<PaginatedProductsResponse> {
    const res = await api.get('/products', { params });
    const payload = res.data;
    if (payload.data && Array.isArray(payload.data)) {
      return {
        data: payload.data,
        meta: payload.meta || { page: 1, limit: 20, total: payload.data.length, totalPages: 1 },
      };
    }
    return payload;
  },

  async getProductById(id: string): Promise<Product> {
    const res = await api.get(`/products/${id}`);
    return res.data.data || res.data;
  },

  async createProduct(data: Partial<Product> & { quantity: number }): Promise<Product> {
    const res = await api.post('/products', data);
    return res.data.data || res.data;
  },

  async updateProduct(id: string, data: Partial<Product> & { quantity?: number }): Promise<Product> {
    const res = await api.patch(`/products/${id}`, data);
    return res.data.data || res.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
