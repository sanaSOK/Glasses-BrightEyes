<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Wholesaler Companies</h1>
      <p class="text-xs text-slate-500 mt-1">Super Admin overview of verified suppliers</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div v-if="loading" class="py-12 text-center text-slate-400 text-sm">
        Loading wholesalers...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">Company Name</th>
              <th class="py-3 px-4">Address</th>
              <th class="py-3 px-4">Province / District</th>
              <th class="py-3 px-4">Phone</th>
              <th class="py-3 px-4 text-center">Listed Products</th>
              <th class="py-3 px-4 text-center">Orders Received</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="w in wholesalers" :key="w.id" class="hover:bg-slate-50/80">
              <td class="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                <img :src="w.logoUrl || 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=150&q=80'" class="w-8 h-8 rounded-lg object-cover" />
                {{ w.companyName }}
              </td>
              <td class="py-3 px-4 text-slate-600">{{ w.businessAddress }}</td>
              <td class="py-3 px-4 text-slate-500">{{ w.province }}, {{ w.district }}</td>
              <td class="py-3 px-4 font-mono">{{ w.phone }}</td>
              <td class="py-3 px-4 text-center font-bold text-purple-700">{{ w._count?.products || 0 }}</td>
              <td class="py-3 px-4 text-center font-bold text-sky-700">{{ w._count?.orders || 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { wholesalerService } from '@/services/wholesaler.service';
import type { Wholesaler } from '@/types';

const wholesalers = ref<Wholesaler[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    wholesalers.value = await wholesalerService.getWholesalers();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
