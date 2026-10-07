<template>
  <div class="space-y-6">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-sky-600/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-sky-100">
          Retailer Portal
        </span>
        <h1 class="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight">
          Welcome back, {{ authStore.user?.name }}!
        </h1>
        <p class="text-sky-100 text-sm mt-1">
          Explore real-time optical inventory, place B2B wholesale orders, and track deliveries across Cambodia.
        </p>
      </div>
      <router-link
        to="/retailer/products"
        class="px-5 py-3 bg-white text-sky-700 hover:bg-sky-50 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 text-center shrink-0"
      >
        Browse Optical Catalog
      </router-link>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Active Wholesalers"
        :value="wholesalerCount"
        :icon="Building2"
        iconBgClass="bg-sky-50"
        iconColorClass="text-sky-600"
        subtext="Verified Suppliers"
      />
      <StatCard
        title="Total Products"
        :value="productCount"
        :icon="Package"
        iconBgClass="bg-purple-50"
        iconColorClass="text-purple-600"
        subtext="Available Optical Items"
      />
      <StatCard
        title="Active Orders"
        :value="activeOrderCount"
        :icon="Clock"
        iconBgClass="bg-amber-50"
        iconColorClass="text-amber-600"
        subtext="Pending / In-Transit"
      />
      <StatCard
        title="My Store Inventory"
        :value="retailerInventoryCount"
        :icon="Warehouse"
        iconBgClass="bg-emerald-50"
        iconColorClass="text-emerald-600"
        subtext="Received Stock Items"
      />
    </div>

    <!-- Main Grid: Recent Orders & Catalog Teaser -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Orders Table -->
      <div class="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList class="w-5 h-5 text-sky-600" /> Recent B2B Orders
          </h2>
          <router-link to="/retailer/orders" class="text-xs font-bold text-sky-600 hover:underline">
            View All Orders →
          </router-link>
        </div>

        <div v-if="loadingOrders" class="py-8 text-center text-slate-400 text-sm">
          Loading orders...
        </div>
        <div v-else-if="orders.length === 0" class="py-12 text-center text-slate-400 text-sm">
          No orders placed yet. <router-link to="/retailer/products" class="text-sky-600 font-bold underline">Start Browsing Catalog</router-link>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th class="py-3 px-3">Order Number</th>
                <th class="py-3 px-3">Supplier</th>
                <th class="py-3 px-3">Total</th>
                <th class="py-3 px-3">Status</th>
                <th class="py-3 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr v-for="order in orders.slice(0, 5)" :key="order.id" class="hover:bg-slate-50/80">
                <td class="py-3 px-3 font-mono font-bold text-sky-700">{{ order.orderNumber }}</td>
                <td class="py-3 px-3 font-medium">{{ order.wholesaler?.companyName || 'Wholesaler' }}</td>
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

      <!-- Quick Cart & Inventory Summary Card -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <ShoppingCart class="w-5 h-5 text-sky-600" /> Cart Summary
          </h2>

          <div v-if="cartStore.itemCount > 0" class="space-y-3">
            <div
              v-for="item in cartStore.items.slice(0, 3)"
              :key="item.id"
              class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
            >
              <div class="truncate pr-2">
                <p class="font-bold text-slate-800 truncate">{{ item.product?.name }}</p>
                <p class="text-[11px] text-slate-400">{{ item.quantity }} x ${{ item.price.toFixed(2) }}</p>
              </div>
              <span class="font-bold text-slate-900 shrink-0">${{ item.subtotal.toFixed(2) }}</span>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-extrabold text-slate-900">
              <span>Subtotal:</span>
              <span class="text-sky-600">${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
          </div>

          <div v-else class="py-8 text-center text-slate-400 text-xs">
            Your shopping cart is currently empty.
          </div>
        </div>

        <router-link
          to="/retailer/cart"
          class="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center transition-all block"
        >
          View Full Cart ({{ cartStore.itemCount }} Items)
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { orderService } from '@/services/order.service';
import { wholesalerService } from '@/services/wholesaler.service';
import { productService } from '@/services/product.service';
import { inventoryService } from '@/services/inventory.service';
import type { Order } from '@/types';
import StatCard from '@/components/common/StatCard.vue';
import OrderStatusBadge from '@/components/common/OrderStatusBadge.vue';
import { Building2, Package, Clock, Warehouse, ClipboardList, ShoppingCart } from 'lucide-vue-next';

const authStore = useAuthStore();
const cartStore = useCartStore();

const orders = ref<Order[]>([]);
const loadingOrders = ref(true);
const wholesalerCount = ref(0);
const productCount = ref(0);
const retailerInventoryCount = ref(0);

onMounted(async () => {
  try {
    const [ordersData, wholesalersData, productsData, retailerInvData] = await Promise.all([
      orderService.getOrders(),
      wholesalerService.getWholesalers(),
      productService.getProducts({ limit: 1 }),
      inventoryService.getRetailerInventory(),
    ]);

    orders.value = ordersData;
    wholesalerCount.value = wholesalersData.length;
    productCount.value = productsData.meta?.total || productsData.data?.length || 0;
    retailerInventoryCount.value = retailerInvData.reduce((sum, item) => sum + item.quantity, 0);
  } catch (err) {
    console.error(err);
  } finally {
    loadingOrders.value = false;
  }
});

const activeOrderCount = computed(() => {
  return orders.value.filter(
    (o) => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'REJECTED'
  ).length;
});
</script>
