<template>
  <div v-if="isOpen && order" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800 font-sans">
      <!-- Modal Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            <ClipboardList class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h2 class="text-base font-bold text-slate-900">{{ order.orderNo }}</h2>
              <span
                :class="[
                  'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide',
                  order.orderType === 'RX Lab Order' ? 'bg-indigo-100 text-indigo-800' :
                  order.orderType === 'Stock Lens Order' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-purple-100 text-purple-800'
                ]"
              >
                {{ order.orderType }}
              </span>
              <span v-if="order.isUrgent" class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500 text-white animate-pulse">
                🔥 Urgent Rush
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              Patient: <strong class="text-slate-800">{{ order.patientName }}</strong> ({{ order.patientCode }}) | Tray: <span class="font-mono font-bold text-indigo-600">{{ order.trayId }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="$emit('print', order)"
            class="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition flex items-center space-x-1.5"
          >
            <Printer class="w-3.5 h-3.5 text-slate-500" />
            <span>Job Slip</span>
          </button>
          <button
            @click="$emit('close')"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Modal Content Body -->
      <div class="p-6 overflow-y-auto space-y-6 text-xs">
        <!-- Status Progression Bar -->
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fulfillment Stage Pipeline</span>
            <span class="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
              Current: <span class="text-indigo-600">{{ order.orderStatus }}</span>
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-6 gap-1.5 text-center text-[10px] font-bold">
            <button
              v-for="st in stages"
              :key="st"
              @click="$emit('updateStatus', order.id, st)"
              :class="[
                'p-2 rounded-xl border transition cursor-pointer flex flex-col items-center justify-center gap-1',
                order.orderStatus === st
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              ]"
            >
              <span>{{ st }}</span>
            </button>
          </div>
        </div>

        <!-- Customer & Order Meta Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Buyer & Branch</span>
            <p class="font-bold text-slate-800">{{ order.buyer || 'N/A' }}</p>
            <p class="text-slate-500">{{ order.shop || 'Central Shop' }}</p>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ordering Person</span>
            <p class="font-bold text-slate-800">{{ order.orderingPerson || 'Optometrist' }}</p>
            <p class="text-slate-500 font-mono">Ref: {{ order.orderRef || 'None' }}</p>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Dates</span>
            <p class="font-medium text-slate-700">Ordered: {{ new Date(order.orderDate).toLocaleDateString() }}</p>
            <p class="text-indigo-600 font-semibold">Logistics: {{ order.logisticsDate ? new Date(order.logisticsDate).toLocaleDateString() : 'N/A' }}</p>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Order Financials</span>
            <p class="text-base font-extrabold text-emerald-600">${{ order.totalAmount.toFixed(2) }}</p>
            <p class="text-slate-500">{{ order.totalPieces }} pieces / items</p>
          </div>
        </div>

        <!-- Frame Measurements Section (if present) -->
        <div v-if="order.frame" class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>📐 Frame Dimensions & Fitting Angles</span>
            </h3>
            <span class="text-[11px] text-slate-600 font-medium">
              Shape: <strong>{{ order.frame.frameShape || 'Standard' }}</strong> | Type: <strong>{{ order.frame.frameType || 'Metal Fullrim' }}</strong>
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center font-mono">
            <div class="p-2 bg-white rounded-xl border border-slate-200">
              <span class="text-[9px] text-slate-400 uppercase font-sans block">A (Width)</span>
              <span class="font-bold text-slate-900">{{ order.frame.frameWidthA || '-' }}mm</span>
            </div>
            <div class="p-2 bg-white rounded-xl border border-slate-200">
              <span class="text-[9px] text-slate-400 uppercase font-sans block">B (Height)</span>
              <span class="font-bold text-slate-900">{{ order.frame.frameHeightB || '-' }}mm</span>
            </div>
            <div class="p-2 bg-white rounded-xl border border-slate-200">
              <span class="text-[9px] text-slate-400 uppercase font-sans block">ED (Dia)</span>
              <span class="font-bold text-slate-900">{{ order.frame.effectiveDiaEd || '-' }}mm</span>
            </div>
            <div class="p-2 bg-white rounded-xl border border-slate-200">
              <span class="text-[9px] text-slate-400 uppercase font-sans block">DBL (Bridge)</span>
              <span class="font-bold text-slate-900">{{ order.frame.noseBridgeDbl || '-' }}mm</span>
            </div>
            <div class="p-2 bg-white rounded-xl border border-slate-200">
              <span class="text-[9px] text-slate-400 uppercase font-sans block">Tilt</span>
              <span class="font-bold text-slate-900">{{ order.frame.pantoscopicTilt ? order.frame.pantoscopicTilt + '°' : '-' }}</span>
            </div>
            <div class="p-2 bg-white rounded-xl border border-slate-200">
              <span class="text-[9px] text-slate-400 uppercase font-sans block">Wrap Angle</span>
              <span class="font-bold text-slate-900">{{ order.frame.faceFormAngle ? order.frame.faceFormAngle + '°' : '-' }}</span>
            </div>
            <div class="p-2 bg-white rounded-xl border border-slate-200">
              <span class="text-[9px] text-slate-400 uppercase font-sans block">Refracted BVD</span>
              <span class="font-bold text-slate-900">{{ order.frame.refractedBvd || '-' }}mm</span>
            </div>
            <div class="p-2 bg-white rounded-xl border border-slate-200">
              <span class="text-[9px] text-slate-400 uppercase font-sans block">Base Curve</span>
              <span class="font-bold text-slate-900">{{ order.frame.baseCurve || '-' }}D</span>
            </div>
          </div>

          <!-- PD & Fitting Heights -->
          <div class="grid grid-cols-2 gap-3 pt-1">
            <div class="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex justify-between items-center text-[11px]">
              <span class="font-bold text-indigo-950">Right Eye (OD):</span>
              <span class="font-mono text-slate-700">PD Far: <strong>{{ order.frame.pdFarR || '-' }}</strong>mm | PD Near: <strong>{{ order.frame.pdNearR || '-' }}</strong>mm | Height: <strong>{{ order.frame.heightR || '-' }}</strong>mm</span>
            </div>
            <div class="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100 flex justify-between items-center text-[11px]">
              <span class="font-bold text-sky-950">Left Eye (OS):</span>
              <span class="font-mono text-slate-700">PD Far: <strong>{{ order.frame.pdFarL || '-' }}</strong>mm | PD Near: <strong>{{ order.frame.pdNearL || '-' }}</strong>mm | Height: <strong>{{ order.frame.heightL || '-' }}</strong>mm</span>
            </div>
          </div>
        </div>

        <!-- Detailed Prescription Line Items -->
        <div class="space-y-3">
          <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-1">
            <span>👓 Prescription Grid & Optical Parameters</span>
            <span class="text-slate-500 font-mono text-[11px]">{{ order.lensItems?.length || 0 }} Items</span>
          </h3>

          <div class="overflow-x-auto">
            <table class="w-full text-center border-collapse text-xs">
              <thead>
                <tr class="bg-slate-100 text-slate-700 font-bold border-y border-slate-200">
                  <th class="py-2 px-2 text-left">Eye</th>
                  <th class="py-2 px-2 text-left">Product Name</th>
                  <th class="py-2 px-2">SPH</th>
                  <th class="py-2 px-2">CYL</th>
                  <th class="py-2 px-2">Axis</th>
                  <th class="py-2 px-2">ADD</th>
                  <th class="py-2 px-2">Prism</th>
                  <th class="py-2 px-2">Dia</th>
                  <th class="py-2 px-2">Treatments</th>
                  <th class="py-2 px-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 font-mono">
                <tr v-for="item in order.lensItems" :key="item.id" class="hover:bg-slate-50">
                  <td class="py-2.5 px-2 text-left font-sans font-bold" :class="item.eyeSide === 'Right' ? 'text-indigo-600' : item.eyeSide === 'Left' ? 'text-sky-600' : 'text-slate-700'">
                    {{ item.eyeSide || 'PAIR' }}
                  </td>
                  <td class="py-2.5 px-2 text-left font-sans font-medium text-slate-900">
                    {{ item.productName }}
                    <span v-if="item.designType" class="text-[10px] text-slate-500 block">({{ item.designType }}, Index {{ item.refractiveIndex || '1.60' }})</span>
                  </td>
                  <td class="py-2.5 px-2 font-bold">{{ formatDiopter(item.sphere) }}</td>
                  <td class="py-2.5 px-2 font-bold">{{ formatDiopter(item.cylinder) }}</td>
                  <td class="py-2.5 px-2">{{ item.axis !== null && item.axis !== undefined ? item.axis + '°' : '-' }}</td>
                  <td class="py-2.5 px-2 text-emerald-600 font-bold">{{ item.addition ? '+' + item.addition.toFixed(2) : '-' }}</td>
                  <td class="py-2.5 px-2 text-[11px]">{{ item.hPrism ? item.hPrism + 'Δ ' + (item.hBase || '') : '-' }}</td>
                  <td class="py-2.5 px-2">{{ item.diameter || 70 }}mm</td>
                  <td class="py-2.5 px-2 text-[10px] font-sans text-slate-600 max-w-[120px] truncate" :title="item.treatments || ''">
                    {{ item.treatments || item.coating || 'HMC' }}
                  </td>
                  <td class="py-2.5 px-2 text-right font-bold text-slate-900">${{ item.subtotal?.toFixed(2) || '0.00' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Notes / Special Instructions -->
        <div v-if="order.notes" class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <strong class="font-bold flex items-center gap-1"><AlertCircle class="w-3.5 h-3.5 text-amber-600" /> Special Lab Instructions:</strong>
          <p class="font-sans leading-relaxed">{{ order.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClipboardList, Printer, X, AlertCircle } from 'lucide-vue-next';
import type { UnifiedLensOrder } from '@/services/lens.service';

defineProps<{
  isOpen: boolean;
  order: UnifiedLensOrder | null;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'print', order: UnifiedLensOrder): void;
  (e: 'updateStatus', id: string, status: string): void;
}>();

const stages = [
  'Pending',
  'Producing Surfacing',
  'Coating / Tinting',
  'Quality Check',
  'Ready for Dispatch',
  'Shipped',
];

function formatDiopter(val?: number | null) {
  if (val === undefined || val === null) return '-';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(2)}`;
}
</script>
