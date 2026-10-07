import { api } from './api';
import type { Cart } from '@/types';

export const cartService = {
  async getCart(): Promise<Cart> {
    const res = await api.get('/cart');
    return res.data.data || res.data;
  },

  async addItem(productId: string, quantity: number): Promise<Cart> {
    const res = await api.post('/cart/items', { productId, quantity });
    return res.data.data || res.data;
  },

  async updateItemQuantity(itemId: string, quantity: number): Promise<Cart> {
    const res = await api.patch(`/cart/items/${itemId}`, { quantity });
    return res.data.data || res.data;
  },

  async removeItem(itemId: string): Promise<Cart> {
    const res = await api.delete(`/cart/items/${itemId}`);
    return res.data.data || res.data;
  },

  async clearCart(): Promise<Cart> {
    const res = await api.delete('/cart');
    return res.data.data || res.data;
  },
};
