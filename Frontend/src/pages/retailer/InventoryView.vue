<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">My Store Inventory Ledger</h1>
      <p class="text-xs text-slate-500 mt-1">Stock received from fulfilled B2B orders (Foundation for Phase 2 POS)</p>
    </div>

    <div v-if="loading" class="py-12 text-center text-slate-400 text-sm">
      Loading store inventory...
    </div>

    <div v-else-if="inventoryItems.length === 0" class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
      <Warehouse class="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-base font-bold text-slate-800">No Inventory Records Yet</h3>
      <p class="text-xs text-slate-500 mt-1 mb-4">When your B2B orders are DELIVERED, stock will automatically appear in your inventory ledger.</p>
    </div>

    <div v-else class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <span class="text-sm font-bold text-slate-900">In-Store Stock Items ({{ inventoryItems.length }})</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">Product Name</th>
              <th class="py-3 px-4">SKU</th>
              <th class="py-3 px-4">Category</th>
              <th class="py-3 px-4">Wholesaler</th>
              <th class="py-3 px-4 text-center">Store Quantity</th>
              <th class="py-3 px-4 text-right">Last Received</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="item in inventoryItems" :key="item.id" class="hover:bg-slate-50/80">
              <td class="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                <img
                  :src="item.product?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'"
                  class="w-8 h-8 rounded-lg object-contain bg-slate-50 border p-0.5"
                />
                {{ item.product?.name }}
              </td>
              <td class="py-3 px-4 font-mono font-bold text-sky-700">{{ item.product?.SKU }}</td>
              <td class="py-3 px-4">{{ item.product?.category?.name || 'Optical' }}</td>
              <td class="py-3 px-4 text-slate-500">{{ item.product?.wholesaler?.companyName }}</td>
              <td class="py-3 px-4 text-center">
                <span class="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-extrabold text-sm">
                  {{ item.quantity }} units
                </span>
              </td>
              <td class="py-3 px-4 text-right text-slate-400">
                {{ new Date(item.lastUpdated).toLocaleDateString() }}
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
import { inventoryService } from '@/services/inventory.service';
import type { RetailerInventoryItem } from '@/types';
import { Warehouse } from 'lucide-vue-next';

const inventoryItems = ref<RetailerInventoryItem[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    inventoryItems.value = await inventoryService.getRetailerInventory();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
