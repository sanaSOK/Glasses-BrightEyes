<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Optical Products</h1>
      <p class="text-xs text-slate-500 mt-1">Super Admin overview of all products listed across suppliers</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div v-if="loading" class="py-12 text-center text-slate-400 text-sm">
        Loading platform products...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">Product</th>
              <th class="py-3 px-4">SKU</th>
              <th class="py-3 px-4">Category</th>
              <th class="py-3 px-4">Wholesaler</th>
              <th class="py-3 px-4">Retail Price</th>
              <th class="py-3 px-4">Wholesale Price</th>
              <th class="py-3 px-4">Available Stock</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="p in products" :key="p.id" class="hover:bg-slate-50/80">
              <td class="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                <img
                  :src="p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'"
                  class="w-8 h-8 rounded-lg object-contain bg-slate-50 border p-0.5"
                />
                {{ p.name }}
              </td>
              <td class="py-3 px-4 font-mono font-bold text-sky-700">{{ p.SKU }}</td>
              <td class="py-3 px-4">{{ p.category?.name || 'Optical' }}</td>
              <td class="py-3 px-4 font-semibold text-purple-700">{{ p.wholesaler?.companyName }}</td>
              <td class="py-3 px-4 text-slate-400 line-through">${{ p.price.toFixed(2) }}</td>
              <td class="py-3 px-4 font-extrabold text-slate-900">${{ p.wholesalePrice.toFixed(2) }}</td>
              <td class="py-3 px-4">
                <StockBadge
                  :availableQuantity="p.inventory?.availableQuantity"
                  :lowStockThreshold="p.inventory?.lowStockThreshold"
                  :status="p.status"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { productService } from '@/services/product.service';
import type { Product } from '@/types';
import StockBadge from '@/components/common/StockBadge.vue';

const products = ref<Product[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await productService.getProducts({ limit: 100 });
    products.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
