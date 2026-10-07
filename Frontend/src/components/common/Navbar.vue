<template>
  <header class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between">
    <!-- Search / Page Title -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 text-sky-600 font-bold text-xl tracking-tight">
        <img :src="brandLogo" alt="BrightEyes Logo" class="w-9 h-9 rounded-full object-contain shadow-md bg-white p-0.5" />
        <span class="text-slate-900 font-extrabold">Bright<span class="text-sky-600">Eyes</span></span>
        <span class="text-xs px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 font-semibold uppercase tracking-wider ml-1">B2B</span>
      </div>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center gap-4">
      <!-- Cart Icon (Retailer Only) -->
      <router-link
        v-if="authStore.isRetailer"
        to="/retailer/cart"
        class="relative p-2.5 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-slate-100 transition-colors"
      >
        <ShoppingCart class="w-5 h-5" />
        <span
          v-if="cartStore.itemCount > 0"
          class="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-extrabold text-[11px] rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce"
        >
          {{ cartStore.itemCount }}
        </span>
      </router-link>

      <!-- User Profile Dropdown -->
      <div class="flex items-center gap-3 pl-3 border-l border-slate-200">
        <div class="text-right hidden sm:block">
          <p class="text-sm font-bold text-slate-800 leading-tight">{{ authStore.user?.name }}</p>
          <p class="text-xs font-semibold text-slate-500 capitalize">{{ roleLabel }}</p>
        </div>
        <button
          @click="authStore.logout()"
          title="Logout"
          class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut class="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { Glasses, ShoppingCart, LogOut } from 'lucide-vue-next';
import brandLogo from '@/assets/logo.png';

const authStore = useAuthStore();
const cartStore = useCartStore();

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
      return 'Wholesaler Supplier';
    case 'RETAILER':
      return 'Retail Store';
    default:
      return 'User';
  }
});
</script>
