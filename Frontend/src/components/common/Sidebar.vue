<template>
  <aside class="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col justify-between shrink-0 shadow-xl">
    <div>
      <!-- Role Badge -->
      <div class="px-3 py-2.5 mb-6 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
          <ShieldCheck v-if="authStore.isSuperAdmin" class="w-4 h-4" />
          <Building2 v-else-if="authStore.isWholesaler" class="w-4 h-4" />
          <Store v-else class="w-4 h-4" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400">Portal View</p>
          <p class="text-xs font-bold text-white tracking-wider uppercase">{{ portalTitle }}</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-1.5">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          v-slot="{ isActive }"
          class="block"
        >
          <div
            :class="[
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200',
              isActive
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            ]"
          >
            <component :is="item.icon" class="w-4 h-4" />
            <span>{{ item.name }}</span>
            <span
              v-if="item.badge !== undefined && item.badge > 0"
              class="ml-auto px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full"
            >
              {{ item.badge }}
            </span>
          </div>
        </router-link>
      </nav>
    </div>

    <!-- User Profile Footer -->
    <div class="pt-4 border-t border-slate-800/80">
      <div class="flex items-center justify-between text-xs text-slate-500">
        <span>BrightEyes v1.0</span>
        <span class="text-emerald-400 font-semibold flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
        </span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderTree,
  Package,
  Boxes,
  ShoppingCart,
  ClipboardList,
  Warehouse,
  UserCheck,
  ShieldCheck,
  Store,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const cartStore = useCartStore();

const portalTitle = computed(() => {
  if (authStore.isSuperAdmin) return 'Admin Control';
  if (authStore.isWholesaler) return 'Supplier Portal';
  return 'Retail Store';
});

const navItems = computed(() => {
  if (authStore.isSuperAdmin) {
    return [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Users', path: '/admin/users', icon: Users },
      { name: 'Wholesalers', path: '/admin/wholesalers', icon: Building2 },
      { name: 'Categories', path: '/admin/categories', icon: FolderTree },
      { name: 'All Products', path: '/admin/products', icon: Package },
      { name: 'All Orders', path: '/admin/orders', icon: ClipboardList },
    ];
  }

  if (authStore.isWholesaler) {
    return [
      { name: 'Dashboard', path: '/wholesaler', icon: LayoutDashboard },
      { name: 'My Products', path: '/wholesaler/products', icon: Package },
      { name: 'Live Inventory', path: '/wholesaler/inventory', icon: Boxes },
      { name: 'Incoming Orders', path: '/wholesaler/orders', icon: ClipboardList },
      { name: 'Company Profile', path: '/wholesaler/profile', icon: UserCheck },
    ];
  }

  // Retailer
  return [
    { name: 'Dashboard', path: '/retailer', icon: LayoutDashboard },
    { name: 'Optical Catalog', path: '/retailer/products', icon: Package },
    { name: 'Wholesalers', path: '/retailer/wholesalers', icon: Building2 },
    { name: 'Shopping Cart', path: '/retailer/cart', icon: ShoppingCart, badge: cartStore.itemCount },
    { name: 'My Orders', path: '/retailer/orders', icon: ClipboardList },
    { name: 'My Inventory', path: '/retailer/inventory', icon: Warehouse },
    { name: 'Store Profile', path: '/retailer/profile', icon: UserCheck },
  ];
});
</script>
