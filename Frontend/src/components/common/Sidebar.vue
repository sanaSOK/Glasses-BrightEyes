<template>
  <aside
    :class="[
      'relative bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between shrink-0 shadow-xl transition-all duration-300 ease-in-out',
      sidebarStore.isCollapsed ? 'w-20 p-3' : 'w-64 p-4'
    ]"
  >
    <!-- Hide / Show Toggle Button on the Right Border -->
    <button
      @click="sidebarStore.toggle()"
      :title="sidebarStore.isCollapsed ? 'Show Sidebar' : 'Hide Sidebar'"
      :aria-label="sidebarStore.isCollapsed ? 'Show Sidebar' : 'Hide Sidebar'"
      class="absolute -right-3.5 top-14 z-50 w-7 h-7 rounded-full bg-slate-900 hover:bg-sky-600 text-slate-300 hover:text-white border border-slate-700 shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-500"
    >
      <ChevronRight v-if="sidebarStore.isCollapsed" class="w-4 h-4" />
      <ChevronLeft v-else class="w-4 h-4" />
    </button>

    <div>
      <!-- Back to Home Button -->
      <router-link
        to="/"
        :class="[
          'flex items-center mb-5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition group shadow-xs relative',
          sidebarStore.isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5 text-xs font-bold'
        ]"
        title="Go to Landing & Home Page"
      >
        <div class="flex items-center gap-2.5">
          <Home class="w-4 h-4 text-sky-400 group-hover:-translate-x-0.5 transition-transform" />
          <span v-if="!sidebarStore.isCollapsed">Home Page</span>
        </div>
        <ArrowUpRight v-if="!sidebarStore.isCollapsed" class="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />

        <!-- Collapsed Tooltip -->
        <div
          v-if="sidebarStore.isCollapsed"
          class="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50"
        >
          Home Page
        </div>
      </router-link>

      <!-- Navigation Links -->
      <nav class="space-y-1.5">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          v-slot="{ isActive, isExactActive }"
          class="block"
        >
          <div
            :class="[
              'rounded-xl font-medium transition-all duration-200 relative group',
              sidebarStore.isCollapsed ? 'flex items-center justify-center p-2.5' : 'flex items-center gap-3 px-3.5 py-2.5 text-sm',
              (item.path === '/admin' || item.path === '/wholesaler' || item.path === '/retailer')
                ? (isExactActive ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
                : (isActive ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
            ]"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            <span v-if="!sidebarStore.isCollapsed" class="truncate">{{ item.name }}</span>
            
            <!-- Badges -->
            <span
              v-if="!sidebarStore.isCollapsed && item.badge !== undefined && item.badge > 0"
              class="ml-auto px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full"
            >
              {{ item.badge }}
            </span>
            <span
              v-else-if="sidebarStore.isCollapsed && item.badge !== undefined && item.badge > 0"
              class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900"
            />

            <!-- Tooltip on Collapsed hover -->
            <div
              v-if="sidebarStore.isCollapsed"
              class="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-1.5"
            >
              <span>{{ item.name }}</span>
              <span
                v-if="item.badge !== undefined && item.badge > 0"
                class="px-1.5 py-0.2 text-[10px] font-bold bg-rose-500 text-white rounded-full"
              >
                {{ item.badge }}
              </span>
            </div>
          </div>
        </router-link>
      </nav>
    </div>

    <!-- User Profile Footer -->
    <div class="pt-4 border-t border-slate-800/80">
      <div v-if="!sidebarStore.isCollapsed" class="flex items-center justify-between text-xs text-slate-500">
        <span>BrightEyes B2B</span>
        <span class="text-emerald-400 font-semibold flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
        </span>
      </div>
      <div v-else class="flex justify-center items-center py-1 group relative">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <div class="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-emerald-400 text-[11px] font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
          BrightEyes B2B • Online
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { useSidebarStore } from '@/stores/sidebar.store';
import {
  Home,
  ArrowUpRight,
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
  Grid,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const cartStore = useCartStore();
const sidebarStore = useSidebarStore();
const route = useRoute();

const currentPortal = computed(() => {
  return authStore.role || 'RETAILER';
});

const navItems = computed(() => {
  if (currentPortal.value === 'SUPER_ADMIN') {
    return [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Lens Matrix POS', path: '/admin/lenses', icon: Grid },
      { name: 'Users', path: '/admin/users', icon: Users },
      { name: 'Wholesalers', path: '/admin/wholesalers', icon: Building2 },
      { name: 'Categories', path: '/admin/categories', icon: FolderTree },
      { name: 'All Products', path: '/admin/products', icon: Package },
      { name: 'All Orders', path: '/admin/orders', icon: ClipboardList },
    ];
  }

  if (currentPortal.value === 'WHOLESALER') {
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
