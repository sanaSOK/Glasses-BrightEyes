import { api } from './api';
import type { User, Order } from '@/types';

export interface AdminOverview {
  totalUsers: number;
  totalWholesalers: number;
  totalRetailers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalCategories: number;
  recentOrders: Order[];
}

export const adminService = {
  async getOverview(): Promise<AdminOverview> {
    const res = await api.get('/admin/overview');
    return res.data.data || res.data;
  },

  async getUsers(): Promise<User[]> {
    const res = await api.get('/admin/users');
    return res.data.data || res.data;
  },

  async toggleUserActive(userId: string, active: boolean): Promise<User> {
    const res = await api.patch(`/admin/users/${userId}/status`, { active });
    return res.data.data || res.data;
  },
};
