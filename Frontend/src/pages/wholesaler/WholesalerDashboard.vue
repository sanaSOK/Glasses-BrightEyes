<template>
  <div class="space-y-6">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-purple-600/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-purple-100">
          Supplier Operations
        </span>
        <h1 class="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight">
          {{ authStore.user?.wholesaler?.companyName || authStore.user?.name }}
        </h1>
        <p class="text-purple-100 text-sm mt-1">
          Manage product listings, monitor real-time stock levels, and process incoming retailer orders.
        </p>
      </div>
      <router-link
        to="/wholesaler/products"
        class="px-5 py-3 bg-white text-purple-800 hover:bg-purple-50 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 text-center shrink-0"
      >
        + Add New Product
      </router-link>
    </div>

    <!-- Stat Cards (Requirement 15) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Products"
        :value="stats.totalProducts"
        :icon="Package"
        iconBgClass="bg-purple-50"
        iconColorClass="text-purple-600"
        :subtext="`${stats.activeProducts} Active Listed`"
      />
      <StatCard
        title="Out of Stock / Low Stock"
        :value="stats.lowStockProducts"
        :icon="AlertTriangle"
        iconBgClass="bg-amber-50"
        iconColorClass="text-amber-600"
        :subtext="`${stats.outOfStockProducts} Out of Stock`"
      />
      <StatCard
        title="Pending Orders"
        :value="stats.pendingOrders"
        :icon="Clock"
        iconBgClass="bg-sky-50"
        iconColorClass="text-sky-600"
        subtext="Requires Confirmation"
      />
      <StatCard
        title="Delivered Orders"
        :value="stats.deliveredOrders"
        :icon="CheckCheck"
        iconBgClass="bg-emerald-50"
        iconColorClass="text-emerald-600"
        subtext="Fulfilled Orders"
      />
    </div>

    <!-- Recent Incoming B2B Orders Table -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
          <ClipboardList class="w-5 h-5 text-purple-600" /> Incoming Retailer Orders
        </h2>
        <router-link to="/wholesaler/orders" class="text-xs font-bold text-purple-600 hover:underline">
          View All Incoming Orders →
        </router-link>
      </div>

      <div v-if="loading" class="py-8 text-center text-slate-400 text-sm">
        Loading incoming orders...
      </div>

      <div v-else-if="orders.length === 0" class="py-12 text-center text-slate-400 text-sm">
        No orders received yet.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3 px-3">Order #</th>
              <th class="py-3 px-3">Retail Store</th>
              <th class="py-3 px-3">Location</th>
              <th class="py-3 px-3">Total</th>
              <th class="py-3 px-3">Status</th>
              <th class="py-3 px-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="order in orders.slice(0, 5)" :key="order.id" class="hover:bg-slate-50/80">
              <td class="py-3 px-3 font-mono font-bold text-purple-700">{{ order.orderNumber }}</td>
              <td class="py-3 px-3 font-bold text-slate-900">{{ order.retailer?.storeName }}</td>
              <td class="py-3 px-3 text-slate-500">{{ order.province }}, {{ order.district }}</td>
              <td class="py-3 px-3 font-bold text-slate-900">${{ order.total.toFixed(2) }}</td>
              <td class="py-3 px-3">
                <OrderStatusBadge :status="order.orderStatus" />
              </td>
              <td class="py-3 px-3 text-right text-slate-400">
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
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { orderService } from '@/services/order.service';
import { inventoryService } from '@/services/inventory.service';
import { productService } from '@/services/product.service';
import type { Order } from '@/types';
import StatCard from '@/components/common/StatCard.vue';
import OrderStatusBadge from '@/components/common/OrderStatusBadge.vue';
import { Package, AlertTriangle, Clock, CheckCheck, ClipboardList } from 'lucide-vue-next';

const authStore = useAuthStore();
const orders = ref<Order[]>([]);
const loading = ref(true);

const stats = reactive({
  totalProducts: 0,
  activeProducts: 0,
  outOfStockProducts: 0,
  lowStockProducts: 0,
  pendingOrders: 0,
  processingOrders: 0,
  deliveredOrders: 0,
});

onMounted(async () => {
  try {
    const [ordersData, inventoryData] = await Promise.all([
      orderService.getOrders(),
      inventoryService.getWholesalerInventory(),
    ]);

    orders.value = ordersData;

    stats.totalProducts = inventoryData.length;
    stats.activeProducts = inventoryData.filter((i) => i.availableQuantity > 0).length;
    stats.outOfStockProducts = inventoryData.filter((i) => i.availableQuantity === 0).length;
    stats.lowStockProducts = inventoryData.filter(
      (i) => i.availableQuantity > 0 && i.availableQuantity <= i.lowStockThreshold
    ).length;

    stats.pendingOrders = ordersData.filter((o) => o.orderStatus === 'PENDING').length;
    stats.processingOrders = ordersData.filter((o) => o.orderStatus === 'PROCESSING').length;
    stats.deliveredOrders = ordersData.filter((o) => o.orderStatus === 'DELIVERED').length;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
