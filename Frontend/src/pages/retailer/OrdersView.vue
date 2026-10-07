<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Order History & Tracking</h1>
        <p class="text-xs text-slate-500 mt-1">Track status, delivery details, and order line items</p>
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
        <button
          v-for="st in statusTabs"
          :key="st.value"
          @click="changeStatusFilter(st.value)"
          :class="[
            'px-3 py-1.5 rounded-lg transition-all whitespace-nowrap',
            activeStatusFilter === st.value
              ? 'bg-white text-slate-900 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          {{ st.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="orderStore.loading" class="py-12 text-center text-slate-400 text-sm">
      Loading order history...
    </div>

    <!-- Empty State -->
    <div v-else-if="orderStore.orders.length === 0" class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
      <ClipboardList class="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-base font-bold text-slate-800">No Orders Found</h3>
      <p class="text-xs text-slate-500 mt-1 mb-4">You have not placed any orders under this filter status.</p>
      <router-link to="/retailer/products" class="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-md">
        Browse Products
      </router-link>
    </div>

    <!-- Orders Accordion List -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orderStore.orders"
        :key="order.id"
        class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
      >
        <!-- Card Header -->
        <div class="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
          <div class="flex items-center gap-4">
            <div>
              <span class="text-xs text-slate-400 font-mono block">Order ID</span>
              <span class="font-extrabold text-sky-700 font-mono text-sm">{{ order.orderNumber }}</span>
            </div>
            <div class="hidden sm:block">
              <span class="text-xs text-slate-400 block">Date</span>
              <span class="text-xs font-semibold text-slate-700">{{ new Date(order.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <OrderStatusBadge :status="order.orderStatus" />
            <div class="text-right">
              <span class="text-xs text-slate-400 block">Total</span>
              <span class="text-base font-extrabold text-slate-900">${{ order.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Card Body: Details & Items -->
        <div class="p-5 space-y-4">
          <!-- Supplier Info & Delivery -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
            <div>
              <span class="font-bold text-slate-800 block mb-1">Wholesaler Supplier</span>
              <p class="font-semibold text-slate-700">{{ order.wholesaler?.companyName }}</p>
              <p class="text-slate-500">{{ order.wholesaler?.phone }} | {{ order.wholesaler?.email }}</p>
            </div>
            <div>
              <span class="font-bold text-slate-800 block mb-1">Shipping Details</span>
              <p class="text-slate-700">{{ order.shippingAddress }}, {{ order.district }}, {{ order.province }}</p>
              <p v-if="order.delivery?.trackingNumber" class="text-sky-700 font-mono font-semibold mt-1">
                Tracking #: {{ order.delivery.trackingNumber }}
              </p>
            </div>
          </div>

          <!-- Items Table -->
          <div>
            <span class="text-xs font-bold text-slate-800 mb-2 block">Order Items</span>
            <div class="space-y-2">
              <div
                v-for="item in order.orderItems"
                :key="item.id"
                class="flex items-center justify-between text-xs p-2.5 rounded-xl border border-slate-100 bg-white"
              >
                <div class="flex items-center gap-3">
                  <span class="font-mono text-slate-400 font-bold">SKU: {{ item.SKU }}</span>
                  <span class="font-bold text-slate-800">{{ item.productName }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-slate-500">{{ item.quantity }} x ${{ item.price.toFixed(2) }}</span>
                  <span class="font-extrabold text-slate-900">${{ item.subtotal.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions: Cancel Pending Order -->
          <div v-if="order.orderStatus === 'PENDING'" class="flex justify-end pt-2">
            <button
              @click="cancelOrder(order.id)"
              class="px-3.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel Order (Release Reserved Stock)
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrderStore } from '@/stores/order.store';
import type { OrderStatus } from '@/types';
import OrderStatusBadge from '@/components/common/OrderStatusBadge.vue';
import { ClipboardList } from 'lucide-vue-next';

const orderStore = useOrderStore();
const activeStatusFilter = ref<string>('ALL');

const statusTabs = [
  { label: 'All Orders', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

onMounted(() => {
  orderStore.fetchOrders();
});

const changeStatusFilter = (val: string) => {
  activeStatusFilter.value = val;
  orderStore.fetchOrders(val === 'ALL' ? undefined : (val as OrderStatus));
};

const cancelOrder = async (id: string) => {
  if (confirm('Are you sure you want to cancel this pending order? Reserved stock will be released.')) {
    try {
      await orderStore.updateStatus(id, 'CANCELLED');
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    }
  }
};
</script>
