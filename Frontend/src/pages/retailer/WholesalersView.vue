<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Optical Wholesalers Directory</h1>
      <p class="text-xs text-slate-500 mt-1">Discover verified optical suppliers and distributors in Cambodia</p>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="h-44 bg-slate-200/60 rounded-2xl animate-pulse"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="w in wholesalers"
        :key="w.id"
        class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <img
                :src="w.logoUrl || 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=150&q=80'"
                :alt="w.companyName"
                class="w-12 h-12 rounded-xl object-cover border border-slate-100"
              />
              <div>
                <h3 class="font-bold text-slate-900 text-base">{{ w.companyName }}</h3>
                <p class="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin class="w-3.5 h-3.5 text-slate-400" /> {{ w.province }}, {{ w.district }}
                </p>
              </div>
            </div>
            <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-full">
              ACTIVE
            </span>
          </div>

          <p class="text-xs text-slate-600 line-clamp-2 mb-4">{{ w.description }}</p>

          <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl mb-4">
            <div>
              <span class="text-slate-400 block">Phone</span>
              <span class="font-semibold text-slate-800">{{ w.phone }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Products Listed</span>
              <span class="font-semibold text-slate-800">{{ w._count?.products || 0 }} Products</span>
            </div>
          </div>
        </div>

        <button
          @click="browseWholesalerProducts(w.id)"
          class="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Package class="w-4 h-4" /> Browse Company Catalog
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { wholesalerService } from '@/services/wholesaler.service';
import { useProductStore } from '@/stores/product.store';
import type { Wholesaler } from '@/types';
import { MapPin, Package } from 'lucide-vue-next';

const wholesalers = ref<Wholesaler[]>([]);
const loading = ref(true);
const router = useRouter();
const productStore = useProductStore();

onMounted(async () => {
  try {
    wholesalers.value = await wholesalerService.getWholesalers();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const browseWholesalerProducts = (wId: string) => {
  productStore.setFilter('wholesalerId', wId);
  router.push('/retailer/products');
};
</script>
