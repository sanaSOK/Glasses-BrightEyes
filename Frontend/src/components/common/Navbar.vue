<template>
  <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
    <!-- Brand / Home Button -->
    <div class="flex items-center gap-4 shrink-0">
      <router-link
        to="/"
        class="flex items-center gap-2.5 text-sky-600 font-bold text-xl tracking-tight hover:opacity-90 transition group"
        title="Return to Home Page"
      >
        <img :src="brandLogo" alt="BrightEyes Logo" class="w-9 h-9 rounded-full object-contain shadow-md bg-white p-0.5 group-hover:scale-105 transition-transform" />
        <span class="text-slate-900 font-extrabold flex items-center">
          Bright<span class="text-sky-600">Eyes</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-700 font-bold uppercase tracking-wider ml-1.5 border border-sky-200/60">
            B2B
          </span>
        </span>
      </router-link>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Quick Link to Lens Matrix POS (when on admin) -->
      <router-link
        v-if="route.path.startsWith('/admin') && route.path !== '/admin/lenses'"
        to="/admin/lenses"
        class="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200/80 transition shadow-2xs"
        title="Open Lens Matrix & POS Inventory"
      >
        <Grid class="w-3.5 h-3.5 text-indigo-600" />
        <span>Lens Matrix</span>
      </router-link>

      <!-- Cart Icon (Retailer Only) -->
      <router-link
        v-if="authStore.isRetailer"
        to="/retailer/cart"
        class="relative p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-slate-100 transition-colors"
        title="View Shopping Cart"
      >
        <ShoppingCart class="w-5 h-5" />
        <span
          v-if="cartStore.itemCount > 0"
          class="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-extrabold text-[11px] rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce"
        >
          {{ cartStore.itemCount }}
        </span>
      </router-link>

      <!-- User Profile & Quick Role Badge -->
      <div class="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
        <div class="text-right hidden sm:block">
          <p class="text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px]">{{ authStore.user?.name }}</p>
          <span
            :class="[
              'inline-block text-[10px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider',
              authStore.isSuperAdmin ? 'bg-indigo-100 text-indigo-700' :
              authStore.isWholesaler ? 'bg-purple-100 text-purple-700' :
              'bg-sky-100 text-sky-700'
            ]"
          >
            {{ roleLabel }}
          </span>
        </div>

        <button
          @click="handleLogout"
          title="Logout"
          class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut class="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import {
  Grid,
  ShoppingCart,
  LogOut,
} from 'lucide-vue-next';
import brandLogo from '@/assets/logo.png';

const authStore = useAuthStore();
const cartStore = useCartStore();
const route = useRoute();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(() => {
  if (authStore.isRetailer) {
    cartStore.fetchCart();
  }
});

const roleLabel = computed(() => {
  switch (authStore.role) {
    case 'SUPER_ADMIN':
      return 'Super Admin';
    case 'WHOLESALER':
      return 'Wholesaler';
    case 'RETAILER':
      return 'Retail Store';
    default:
      return 'User';
  }
});
</script>
