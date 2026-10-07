<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Orders Monitor</h1>
      <p class="text-xs text-slate-500 mt-1">Super Admin audit of all B2B optical transactions</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div v-if="loading" class="py-12 text-center text-slate-400 text-sm">
        Loading platform orders...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">Order #</th>
              <th class="py-3 px-4">Retailer Store</th>
              <th class="py-3 px-4">Wholesaler</th>
              <th class="py-3 px-4">Total Amount</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Order Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-slate-50/80">
              <td class="py-3 px-4 font-mono font-bold text-sky-700">{{ order.orderNumber }}</td>
              <td class="py-3 px-4 font-bold text-slate-900">{{ order.retailer?.storeName }}</td>
              <td class="py-3 px-4 font-semibold text-purple-700">{{ order.wholesaler?.companyName }}</td>
              <td class="py-3 px-4 font-extrabold text-slate-900">${{ order.total.toFixed(2) }}</td>
              <td class="py-3 px-4">
                <OrderStatusBadge :status="order.orderStatus" />
              </td>
              <td class="py-3 px-4 text-right text-slate-400">
                {{ new Date(order.createdAt).toLocaleDateString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { orderService } from '@/services/order.service';
import type { Order } from '@/types';
import OrderStatusBadge from '@/components/common/OrderStatusBadge.vue';

const orders = ref<Order[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    orders.value = await orderService.getOrders();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
