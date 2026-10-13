<template>
  <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
    <!-- Header: Product Categories & Treatment Controls -->
    <div class="p-6 border-b border-slate-100 bg-slate-50 space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Module B • Interactive SPH / CYL Matrix Grid
          </span>
          <h2 class="text-xl font-extrabold mt-1 tracking-tight text-slate-900">Stock Lens Ordering & Inventory Matrix</h2>
          <p class="text-xs text-slate-500 mt-0.5">Direct cell quantity inputs across full power intersections with live batch fulfillment</p>
        </div>

        <!-- Header Actions: Back and Range Mode -->
        <div class="flex items-center space-x-2 self-start md:self-auto">
          <button
            type="button"
            @click="emit('cancelled')"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition flex items-center space-x-1 cursor-pointer shadow-2xs"
            title="Return to Order Tracking"
          >
            <span>&larr; Back to Dashboard</span>
          </button>

          <!-- Range Mode (Minus vs Plus Sphere) -->
          <div class="flex items-center space-x-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              @click="sphRangeMode = 'minus'"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
                sphRangeMode === 'minus' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              Minus SPH (-6.00 to 0.00)
            </button>
            <button
              type="button"
              @click="sphRangeMode = 'plus'"
              :class="[
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
                sphRangeMode === 'plus' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              Plus SPH (0.00 to +6.00)
            </button>
          </div>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          @click="selectCategory(cat)"
          :class="[
            'px-4 py-2 rounded-2xl text-xs font-bold transition shrink-0 border cursor-pointer flex items-center space-x-2',
            selectedCategory.id === cat.id
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
          ]"
        >
          <span>{{ cat.name }}</span>
          <span
            :class="[
              'px-1.5 py-0.2 rounded text-[10px] font-mono',
              selectedCategory.id === cat.id ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'
            ]"
          >
            ${{ cat.basePrice.toFixed(2) }}
          </span>
        </button>
      </div>

      <!-- Treatment / Coating Toggles -->
      <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/70 text-xs">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Coating / Treatment:</span>
        <button
          v-for="trt in treatments"
          :key="trt"
          type="button"
          @click="selectedTreatment = trt"
          :class="[
            'px-3 py-1 rounded-xl font-bold transition border cursor-pointer',
            selectedTreatment === trt
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          ]"
        >
          {{ trt }}
        </button>
      </div>
    </div>

    <!-- Live Batch Order Summary & Action Bar (Sticky at Top of Matrix) -->
    <div class="bg-indigo-900 text-white p-4 px-6 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-md">
      <div class="flex items-center space-x-4 sm:space-x-8 text-xs">
        <div>
          <span class="text-[10px] text-indigo-300 uppercase tracking-widest block font-bold">TOTAL PIECES</span>
          <span class="text-xl font-black font-mono text-emerald-400">{{ totalPieces }} pcs</span>
        </div>
        <div>
          <span class="text-[10px] text-indigo-300 uppercase tracking-widest block font-bold">SELECTED CELLS</span>
          <span class="text-xl font-black font-mono text-cyan-300">{{ selectedCellsCount }}</span>
        </div>
        <div>
          <span class="text-[10px] text-indigo-300 uppercase tracking-widest block font-bold">ORDER ESTIMATE</span>
          <span class="text-xl font-black font-mono text-white">${{ totalOrderPrice.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Inputs & Actions -->
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <input
          v-model="batchOrder.buyer"
          type="text"
          placeholder="Buyer Store Name"
          class="bg-indigo-950/80 border border-indigo-700/60 rounded-xl px-3 py-1.5 text-white placeholder-indigo-300/60 font-medium text-xs w-44"
        />
        <input
          v-model="batchOrder.trayId"
          type="text"
          placeholder="Tray / Box ID"
          class="bg-indigo-950/80 border border-indigo-700/60 rounded-xl px-3 py-1.5 text-white placeholder-indigo-300/60 font-mono text-xs w-28"
        />

        <button
          type="button"
          @click="clearAllQuantities"
          class="px-3 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-indigo-200 hover:text-white rounded-xl font-bold transition text-xs"
        >
          Reset
        </button>

        <button
          type="button"
          @click="submitStockOrder"
          :disabled="totalPieces === 0 || isSubmitting"
          class="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
        >
          <ShoppingCart class="w-4 h-4" />
          <span>{{ isSubmitting ? 'Placing...' : 'Submit Stock Order' }}</span>
        </button>
      </div>
    </div>

    <!-- Matrix Power Intersection Grid -->
    <div class="overflow-x-auto max-h-[600px] overflow-y-auto p-4 bg-slate-100/60">
      <table class="w-full text-center border-collapse text-xs select-none">
        <!-- Cylinder Header Columns -->
        <thead class="sticky top-0 z-10 bg-slate-800 text-white font-mono shadow-xs">
          <tr>
            <th class="p-2.5 px-3 bg-slate-900 sticky left-0 z-20 text-left font-sans font-extrabold text-[11px] min-w-[90px] border-r border-slate-700">
              SPH \ CYL
            </th>
            <th
              v-for="cyl in cylinderColumns"
              :key="cyl"
              class="p-2 px-1 font-bold min-w-[62px] border-r border-slate-700/60 text-[11px]"
            >
              {{ cyl === 0 ? '0.00' : cyl.toFixed(2) }}
            </th>
          </tr>
        </thead>

        <!-- Sphere Rows -->
        <tbody class="divide-y divide-slate-200 font-mono">
          <tr
            v-for="sph in activeSphereRows"
            :key="sph"
            class="hover:bg-slate-200/50 transition"
          >
            <!-- Sphere Label Column (Sticky Left) -->
            <td class="p-2 px-3 bg-white sticky left-0 z-10 font-bold text-left border-r border-slate-200 shadow-2xs font-sans text-xs">
              <span :class="sph > 0 ? 'text-indigo-600' : sph < 0 ? 'text-slate-900' : 'text-slate-500'">
                {{ sph > 0 ? '+' : '' }}{{ sph.toFixed(2) }}
              </span>
            </td>

            <!-- Grid Cells (Intersection) -->
            <td
              v-for="cyl in cylinderColumns"
              :key="`${sph}_${cyl}`"
              :class="[
                'p-1 border-r border-slate-200 transition text-center',
                getCellQuantity(sph, cyl) > 0 ? 'bg-emerald-100/90 ring-1 ring-emerald-500' : 'bg-white hover:bg-slate-50'
              ]"
            >
              <div class="flex flex-col items-center justify-center p-1 rounded-lg">
                <!-- Stock Badge -->
                <span class="text-[9px] text-slate-400 block font-normal leading-tight">
                  Stk: {{ getStockCount(sph, cyl) }}
                </span>

                <!-- Quantity Numeric Input -->
                <input
                  type="number"
                  min="0"
                  max="999"
                  :value="getCellQuantity(sph, cyl) || ''"
                  @input="handleCellInput(sph, cyl, $event)"
                  placeholder="0"
                  class="w-12 h-6 text-center font-bold text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-md transition shadow-2xs"
                  :class="getCellQuantity(sph, cyl) > 0 ? 'text-emerald-800 font-extrabold bg-emerald-50 border-emerald-400' : 'text-slate-700'"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Quick Footer Tip -->
    <div class="p-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
      <div class="flex items-center space-x-3">
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded bg-emerald-100 border border-emerald-400"></span> Selected Cell for Batch Fulfillment
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded bg-white border border-slate-300"></span> Available Matrix Cell
        </span>
      </div>
      <span class="font-mono text-[11px] text-slate-400">Power Step: 0.25D | Base Curvature Matched</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { ShoppingCart } from 'lucide-vue-next';
import { lensService, type UnifiedLensOrder } from '@/services/lens.service';

const emit = defineEmits<{
  (e: 'submitted', order: UnifiedLensOrder): void;
  (e: 'cancelled'): void;
}>();

// Categories
const categories = [
  { id: '1.499-clear', name: '1.499 Clear SV', index: 1.5, material: 'CR-39 Plastic', basePrice: 12.0 },
  { id: '1.56-blueblock', name: '1.56 BlueBlock HMC', index: 1.56, material: 'CR-39 Plastic', basePrice: 18.0 },
  { id: '1.60-hi-index', name: '1.60 Hi-Index Super HMC', index: 1.6, material: 'MR-8 Resin', basePrice: 28.0 },
  { id: '1.67-aspheric', name: '1.67 Aspheric BlueCut', index: 1.67, material: 'MR-7 Resin', basePrice: 42.0 },
  { id: '1.56-photo', name: '1.56 Photochromic FastGrey', index: 1.56, material: 'Photochromic Monomer', basePrice: 32.0 },
];

const treatments = ['UNC', 'HC', 'HMC', 'Super HMC', 'Anti-Fog HMC'];

const selectedCategory = ref(categories[1]); // Default to popular 1.56 BlueBlock
const selectedTreatment = ref('HMC');
const sphRangeMode = ref<'minus' | 'plus'>('minus');
const isSubmitting = ref(false);

const batchOrder = reactive({
  buyer: 'Phnom Penh Eyewear Center',
  trayId: 'BOX-STK-09',
});

// Cells map: key = `${sph}_${cyl}`, value = quantity
const orderMatrix = reactive<Record<string, number>>({});

// Stock mockup generator seeded predictably by sph & cyl
function getStockCount(sph: number, cyl: number): number {
  const seed = Math.abs(sph * 10) + Math.abs(cyl * 10) + 13;
  return ((seed * 7) % 65) + 12;
}

// Cylinder columns: 0.00 down to -4.00 (step 0.25)
const cylinderColumns = computed(() => {
  const cols: number[] = [];
  for (let c = 0; c >= -4.0; c -= 0.25) {
    cols.push(Math.round(c * 100) / 100);
  }
  return cols;
});

// Sphere rows
const activeSphereRows = computed(() => {
  const rows: number[] = [];
  if (sphRangeMode.value === 'minus') {
    // 0.00 down to -6.00
    for (let s = 0; s >= -6.0; s -= 0.25) {
      rows.push(Math.round(s * 100) / 100);
    }
  } else {
    // +0.25 up to +6.00
    for (let s = 0.25; s <= 6.0; s += 0.25) {
      rows.push(Math.round(s * 100) / 100);
    }
  }
  return rows;
});

function getCellQuantity(sph: number, cyl: number): number {
  const key = `${sph}_${cyl}`;
  return orderMatrix[key] || 0;
}

function handleCellInput(sph: number, cyl: number, e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value, 10);
  const key = `${sph}_${cyl}`;
  if (isNaN(val) || val <= 0) {
    delete orderMatrix[key];
  } else {
    orderMatrix[key] = val;
  }
}

function clearAllQuantities() {
  Object.keys(orderMatrix).forEach((k) => delete orderMatrix[k]);
}

function selectCategory(cat: any) {
  selectedCategory.value = cat;
}

// Computed totals
const totalPieces = computed(() => {
  return Object.values(orderMatrix).reduce((sum, q) => sum + q, 0);
});

const selectedCellsCount = computed(() => {
  return Object.keys(orderMatrix).filter((k) => orderMatrix[k] > 0).length;
});

const totalOrderPrice = computed(() => {
  return totalPieces.value * selectedCategory.value.basePrice;
});

async function submitStockOrder() {
  if (totalPieces.value === 0) return;
  isSubmitting.value = true;
  try {
    const items = Object.entries(orderMatrix).map(([key, qty]) => {
      const [sphStr, cylStr] = key.split('_');
      const sph = parseFloat(sphStr);
      const cyl = parseFloat(cylStr);
      return {
        productName: `${selectedCategory.value.name} (${selectedTreatment.value})`,
        lensType: 'Stock Lens',
        designType: 'Spherical',
        refractiveIndex: selectedCategory.value.index,
        material: selectedCategory.value.material,
        coating: selectedTreatment.value,
        treatments: selectedTreatment.value,
        quantity: qty,
        eyeSide: 'PAIR',
        sphere: sph,
        cylinder: cyl,
        diameter: 72,
        unitPrice: selectedCategory.value.basePrice,
        subtotal: qty * selectedCategory.value.basePrice,
      };
    });

    const payload: Partial<UnifiedLensOrder> = {
      orderNo: `STK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      orderRef: `PO-${Date.now().toString().slice(-6)}`,
      orderType: 'Stock Lens Order',
      buyer: batchOrder.buyer || 'Central Optical Distribution',
      shop: 'Main Inventory',
      orderingPerson: 'Inventory Manager',
      patientName: 'Stock Matrix Batch Replenish',
      patientCode: `WH-${selectedCategory.value.id.toUpperCase()}`,
      trayId: batchOrder.trayId || 'BOX-STK',
      orderStatus: 'Ready for Dispatch',
      orderDate: new Date().toISOString(),
      logisticsDate: new Date(Date.now() + 86400000).toISOString(),
      isUrgent: false,
      accountCode: 'ACC-STK-01',
      notes: `Batch fulfillment: ${selectedCategory.value.name} [${selectedTreatment.value}] across ${selectedCellsCount.value} matrix cells.`,
      totalAmount: totalOrderPrice.value,
      totalPieces: totalPieces.value,
      frame: null,
      lensItems: items,
    };

    const res = await lensService.createUnifiedOrder(payload);
    clearAllQuantities();
    emit('submitted', res);
  } catch (err: any) {
    alert(err?.message || 'Failed to submit Stock Lens Order');
  } finally {
    isSubmitting.value = false;
  }
}
</script>
