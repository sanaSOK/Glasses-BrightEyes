<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Real-Time "Live Stock" Management</h1>
      <p class="text-xs text-slate-500 mt-1">Monitor total quantity, reserved B2B order quantity, available stock, and thresholds</p>
    </div>

    <!-- Live Stock Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div v-if="loading" class="py-12 text-center text-slate-400 text-sm">
        Loading live stock inventory...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">Product</th>
              <th class="py-3 px-4">SKU</th>
              <th class="py-3 px-4 text-center">Total Quantity</th>
              <th class="py-3 px-4 text-center">Reserved Quantity</th>
              <th class="py-3 px-4 text-center">Available Quantity</th>
              <th class="py-3 px-4 text-center">Low Threshold</th>
              <th class="py-3 px-4 text-center">Status</th>
              <th class="py-3 px-4 text-right">Quick Adjust</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="inv in inventories" :key="inv.id" class="hover:bg-slate-50/80">
              <td class="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                <img
                  :src="inv.product?.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'"
                  class="w-8 h-8 rounded-lg object-contain bg-slate-50 border p-0.5"
                />
                {{ inv.product?.name }}
              </td>
              <td class="py-3 px-4 font-mono font-bold text-purple-700">{{ inv.product?.SKU }}</td>
              <td class="py-3 px-4 text-center font-extrabold text-slate-900 text-sm">{{ inv.quantity }}</td>
              <td class="py-3 px-4 text-center font-bold text-amber-600 bg-amber-50/50 rounded-lg">
                {{ inv.reservedQuantity }}
              </td>
              <td class="py-3 px-4 text-center font-extrabold text-emerald-700 bg-emerald-50/50 rounded-lg text-sm">
                {{ inv.availableQuantity }}
              </td>
              <td class="py-3 px-4 text-center font-semibold text-slate-500">{{ inv.lowStockThreshold }}</td>
              <td class="py-3 px-4 text-center">
                <StockBadge
                  :availableQuantity="inv.availableQuantity"
                  :lowStockThreshold="inv.lowStockThreshold"
                />
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  @click="openAdjustModal(inv)"
                  class="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-xl font-bold transition-colors"
                >
                  Adjust Stock
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Quick Stock Adjust Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
        <h3 class="text-base font-extrabold text-slate-900">Adjust Live Inventory Stock</h3>
        <p class="text-xs text-slate-500">{{ selectedInv?.product?.name }} (SKU: {{ selectedInv?.product?.SKU }})</p>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Total Quantity in Warehouse</label>
            <input v-model.number="adjustQty" type="number" min="0" class="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Low Stock Warning Threshold</label>
            <input v-model.number="adjustThreshold" type="number" min="0" class="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
          </div>

          <div class="p-3 bg-slate-50 rounded-xl text-slate-600 text-[11px] space-y-1">
            <p>Reserved Quantity: <strong class="text-amber-700">{{ selectedInv?.reservedQuantity }}</strong></p>
            <p>New Available Quantity: <strong class="text-emerald-700">{{ Math.max(0, adjustQty - (selectedInv?.reservedQuantity || 0)) }}</strong></p>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t">
          <button @click="showModal = false" class="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
          <button @click="saveStock" :disabled="saving" class="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">
            {{ saving ? 'Saving...' : 'Update Stock' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { inventoryService } from '@/services/inventory.service';
import type { Inventory } from '@/types';
import StockBadge from '@/components/common/StockBadge.vue';

const inventories = ref<Inventory[]>([]);
const loading = ref(true);
const showModal = ref(false);
const selectedInv = ref<Inventory | null>(null);
const adjustQty = ref(0);
const adjustThreshold = ref(10);
const saving = ref(false);

const loadInventory = async () => {
  loading.value = true;
  try {
    inventories.value = await inventoryService.getWholesalerInventory();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadInventory);

const openAdjustModal = (inv: Inventory) => {
  selectedInv.value = inv;
  adjustQty.value = inv.quantity;
  adjustThreshold.value = inv.lowStockThreshold;
  showModal.value = true;
};

const saveStock = async () => {
  if (!selectedInv.value) return;
  saving.value = true;
  try {
    await inventoryService.updateStock(selectedInv.value.productId, adjustQty.value, adjustThreshold.value);
    showModal.value = false;
    await loadInventory();
  } catch (err: any) {
    alert(err.message || 'Failed to update stock');
  } finally {
    saving.value = false;
  }
};
</script>
