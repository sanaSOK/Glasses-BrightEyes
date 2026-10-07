<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Incoming B2B Retailer Orders</h1>
        <p class="text-xs text-slate-500 mt-1">Accept, confirm, process, ship, and update order status machine</p>
      </div>

      <!-- Filter Tabs -->
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

    <!-- Orders List -->
    <div v-if="orderStore.loading" class="py-12 text-center text-slate-400 text-sm">
      Loading incoming orders...
    </div>

    <div v-else-if="orderStore.orders.length === 0" class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
      <ClipboardList class="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-base font-bold text-slate-800">No Orders Found</h3>
      <p class="text-xs text-slate-500 mt-1">No incoming orders match the current status filter.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in orderStore.orders"
        :key="order.id"
        class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
      >
        <!-- Header -->
        <div class="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
          <div class="flex items-center gap-4">
            <div>
              <span class="text-xs text-slate-400 font-mono block">Order ID</span>
              <span class="font-extrabold text-purple-700 font-mono text-sm">{{ order.orderNumber }}</span>
            </div>
            <div>
              <span class="text-xs text-slate-400 block">Retail Store</span>
              <span class="text-xs font-bold text-slate-900">{{ order.retailer?.storeName }}</span>
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

        <!-- Body -->
        <div class="p-5 space-y-4">
          <!-- Retailer Info & Address -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
            <div>
              <span class="font-bold text-slate-800 block mb-1">Retailer Store Contact</span>
              <p class="font-semibold text-slate-700">{{ order.retailer?.storeName }}</p>
              <p class="text-slate-500">Phone: {{ order.phone }}</p>
            </div>
            <div>
              <span class="font-bold text-slate-800 block mb-1">Shipping Address</span>
              <p class="text-slate-700">{{ order.shippingAddress }}, {{ order.district }}, {{ order.province }}</p>
              <p v-if="order.delivery?.trackingNumber" class="text-purple-700 font-mono font-semibold mt-1">
                Tracking #: {{ order.delivery.trackingNumber }}
              </p>
            </div>
          </div>

          <!-- Items Table -->
          <div>
            <span class="text-xs font-bold text-slate-800 mb-2 block">Ordered Items</span>
            <div class="space-y-1.5">
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

          <!-- Order Status State Machine Actions -->
          <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <span class="text-xs font-semibold text-slate-500">
              Current Status: <strong class="text-slate-900">{{ order.orderStatus }}</strong>
            </span>

            <div class="flex items-center gap-2">
              <button
                v-if="order.orderStatus === 'PENDING'"
                @click="updateStatus(order.id, 'CONFIRMED')"
                class="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Confirm Order
              </button>
              <button
                v-if="order.orderStatus === 'CONFIRMED'"
                @click="updateStatus(order.id, 'PROCESSING')"
                class="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Start Processing
              </button>
              <button
                v-if="order.orderStatus === 'PROCESSING'"
                @click="updateStatus(order.id, 'READY_FOR_DELIVERY')"
                class="px-3.5 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Mark Ready for Delivery
              </button>
              <button
                v-if="order.orderStatus === 'READY_FOR_DELIVERY'"
                @click="updateStatus(order.id, 'SHIPPED')"
                class="px-3.5 py-1.5 bg-cyan-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Mark Shipped
              </button>
              <button
                v-if="order.orderStatus === 'SHIPPED'"
                @click="updateStatus(order.id, 'DELIVERED')"
                class="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Mark Delivered (Fulfill & Update Retailer Stock)
              </button>
              <button
                v-if="order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED'"
                @click="updateStatus(order.id, 'REJECTED')"
                class="px-3.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold"
              >
                Reject Order
              </button>
            </div>
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
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Ready for Delivery', value: 'READY_FOR_DELIVERY' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
];

onMounted(() => {
  orderStore.fetchOrders();
});

const changeStatusFilter = (val: string) => {
  activeStatusFilter.value = val;
  orderStore.fetchOrders(val === 'ALL' ? undefined : (val as OrderStatus));
};

const updateStatus = async (id: string, status: OrderStatus) => {
  try {
    await orderStore.updateStatus(id, status);
  } catch (err: any) {
    alert(err.message || 'Failed to update order status');
  }
};
</script>
