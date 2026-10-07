import { api } from './api';
import type { Inventory, RetailerInventoryItem } from '@/types';

export const inventoryService = {
  async getWholesalerInventory(): Promise<Inventory[]> {
    const res = await api.get('/inventory');
    return res.data.data || res.data;
  },

  async updateStock(
    productId: string,
    quantity: number,
    lowStockThreshold?: number,
  ): Promise<Inventory> {
    const res = await api.patch(`/inventory/${productId}`, {
      quantity,
      lowStockThreshold,
    });
    return res.data.data || res.data;
  },

  async getRetailerInventory(): Promise<RetailerInventoryItem[]> {
    const res = await api.get('/inventory/retailer');
    return res.data.data || res.data;
  },
};
