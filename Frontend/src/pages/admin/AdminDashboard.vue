<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <span class="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-sky-300">
          Super Admin Panel
        </span>
        <h1 class="text-2xl md:text-3xl font-extrabold mt-2 tracking-tight">BrightEyes Platform Overview</h1>
        <p class="text-slate-300 text-sm mt-1">Platform activity, user management, and system overview</p>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Platform Users"
        :value="overview.totalUsers"
        :icon="Users"
        iconBgClass="bg-blue-50"
        iconColorClass="text-blue-600"
      />
      <StatCard
        title="Wholesalers"
        :value="overview.totalWholesalers"
        :icon="Building2"
        iconBgClass="bg-purple-50"
        iconColorClass="text-purple-600"
      />
      <StatCard
        title="Retailers"
        :value="overview.totalRetailers"
        :icon="Store"
        iconBgClass="bg-sky-50"
        iconColorClass="text-sky-600"
      />
      <StatCard
        title="Total B2B Orders"
        :value="overview.totalOrders"
        :icon="ClipboardList"
        iconBgClass="bg-emerald-50"
        iconColorClass="text-emerald-600"
        :subtext="`${overview.pendingOrders} Pending`"
      />
    </div>

    <!-- Recent Platform Activity Table -->
    <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
          <Activity class="w-5 h-5 text-sky-600" /> Recent Platform Activity
        </h2>
        <router-link to="/admin/orders" class="text-xs font-bold text-sky-600 hover:underline">
          View All Platform Orders →
        </router-link>
      </div>

      <div v-if="loading" class="py-8 text-center text-slate-400 text-sm">
        Loading overview data...
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
              <th class="py-3 px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="order in overview.recentOrders" :key="order.id" class="hover:bg-slate-50/80">
              <td class="py-3 px-4 font-mono font-bold text-sky-700">{{ order.orderNumber }}</td>
              <td class="py-3 px-4 font-bold text-slate-900">{{ order.retailer?.storeName }}</td>
              <td class="py-3 px-4 font-medium text-slate-600">{{ order.wholesaler?.companyName }}</td>
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
import { ref, reactive, onMounted } from 'vue';
import { adminService, type AdminOverview } from '@/services/admin.service';
import StatCard from '@/components/common/StatCard.vue';
import OrderStatusBadge from '@/components/common/OrderStatusBadge.vue';
import { Users, Building2, Store, ClipboardList, Activity } from 'lucide-vue-next';

const loading = ref(true);

const overview = reactive<AdminOverview>({
  totalUsers: 0,
  totalWholesalers: 0,
  totalRetailers: 0,
  totalProducts: 0,
  totalOrders: 0,
  pendingOrders: 0,
  totalCategories: 0,
  recentOrders: [],
});

onMounted(async () => {
  try {
    const data = await adminService.getOverview();
    Object.assign(overview, data);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
