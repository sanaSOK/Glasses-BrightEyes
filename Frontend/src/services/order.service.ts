import { api } from './api';
import type { Order, OrderStatus, DeliveryMethod } from '@/types';

export interface CreateOrderPayload {
  shippingAddress: string;
  province: string;
  district: string;
  commune?: string;
  phone: string;
  notes?: string;
  deliveryMethod?: DeliveryMethod;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order | Order[]> {
    const res = await api.post('/orders', payload);
    return res.data.data || res.data;
  },

  async getOrders(status?: OrderStatus): Promise<Order[]> {
    const res = await api.get('/orders', { params: { status } });
    return res.data.data || res.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await api.get(`/orders/${id}`);
    return res.data.data || res.data;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return res.data.data || res.data;
  },
};
