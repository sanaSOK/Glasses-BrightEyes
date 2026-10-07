import { defineStore } from 'pinia';
import { ref } from 'vue';
import { orderService, type CreateOrderPayload } from '@/services/order.service';
import type { Order, OrderStatus } from '@/types';

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([]);
  const currentOrder = ref<Order | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchOrders(status?: OrderStatus) {
    loading.value = true;
    error.value = null;
    try {
      orders.value = await orderService.getOrders(status);
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch orders';
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrderById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      currentOrder.value = await orderService.getOrderById(id);
      return currentOrder.value;
    } catch (err: any) {
      error.value = err.message || 'Order not found';
    } finally {
      loading.value = false;
    }
  }

  async function createOrder(payload: CreateOrderPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await orderService.createOrder(payload);
      await fetchOrders();
      return res;
    } catch (err: any) {
      error.value = err.message || 'Failed to create order';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateStatus(id: string, status: OrderStatus) {
    loading.value = true;
    error.value = null;
    try {
      const updated = await orderService.updateOrderStatus(id, status);
      const idx = orders.value.findIndex((o) => o.id === id);
      if (idx !== -1) {
        orders.value[idx] = updated;
      }
      if (currentOrder.value?.id === id) {
        currentOrder.value = updated;
      }
      return updated;
    } catch (err: any) {
      error.value = err.message || 'Failed to update order status';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    orders,
    currentOrder,
    loading,
    error,
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateStatus,
  };
});
