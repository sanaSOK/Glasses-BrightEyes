<template>
  <div v-if="isOpen && order" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 font-sans print:m-0 print:p-0 print:border-none print:shadow-none print:max-h-none">
      <!-- Modal Header (Non-print controls) -->
      <div class="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
        <div class="flex items-center space-x-2">
          <Printer class="w-5 h-5 text-indigo-400" />
          <h2 class="text-sm font-bold tracking-tight">Optical Lab Job Ticket & Barcode Slip</h2>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="triggerPrint"
            class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
          >
            <Printer class="w-3.5 h-3.5" />
            <span>Print Job Slip</span>
          </button>
          <button
            @click="$emit('close')"
            class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Printable Job Ticket Body -->
      <div id="printable-job-slip" class="p-6 md:p-8 space-y-5 overflow-y-auto print:p-4 print:overflow-visible">
        <!-- Top Lab Banner -->
        <div class="flex items-start justify-between border-b-2 border-slate-900 pb-4">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="text-xl font-black text-slate-900 tracking-tight">Bright<span class="text-sky-600">Eyes</span> LAB</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-800 border border-slate-300">
                SURFACING & EDGING
              </span>
              <span v-if="order.isUrgent" class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white animate-pulse">
                🔥 RUSH / URGENT
              </span>
            </div>
            <p class="text-xs text-slate-500 font-mono">Order NO: <strong class="text-slate-900 text-sm">{{ order.orderNo }}</strong></p>
            <p class="text-[11px] text-slate-500">Order Ref: {{ order.orderRef || 'N/A' }} | Type: <strong>{{ order.orderType }}</strong></p>
          </div>

          <!-- Tray ID & Barcode simulation -->
          <div class="text-right space-y-1">
            <div class="inline-block bg-slate-900 text-white px-4 py-2 rounded-xl text-center shadow-xs">
              <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">LAB TRAY ID</span>
              <span class="text-lg font-black font-mono tracking-wider">{{ order.trayId || 'TRAY-01' }}</span>
            </div>
            <!-- Pseudo barcode -->
            <div class="flex justify-end pt-1">
              <div class="font-mono text-[9px] text-slate-400 tracking-[0.25em] bg-slate-50 px-2 py-1 rounded border border-slate-200">
                ||| | |||| || | |||| || |||
                <span class="block text-[8px] tracking-normal text-slate-600">{{ order.orderNo }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Meta Details: Buyer, Patient, Dates -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-medium">
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">Patient Name</span>
            <span class="font-bold text-slate-900">{{ order.patientName || 'N/A' }}</span>
            <span class="text-[10px] text-slate-500 block font-mono">({{ order.patientCode || 'PAT-00' }})</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">Buyer & Shop</span>
            <span class="font-bold text-slate-900 truncate block">{{ order.buyer || 'Direct Optical Shop' }}</span>
            <span class="text-[10px] text-slate-500 truncate block">{{ order.shop || 'Central Shop' }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">Order Date</span>
            <span class="font-bold text-slate-900">{{ new Date(order.orderDate).toLocaleDateString() }}</span>
            <span class="text-[10px] text-slate-500 block">Status: {{ order.orderStatus }}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block">Target Logistics</span>
            <span class="font-bold text-indigo-700">{{ order.logisticsDate ? new Date(order.logisticsDate).toLocaleDateString() : 'Immediate' }}</span>
            <span class="text-[10px] text-slate-500 block">Acc: {{ order.accountCode || 'ACC-DEFAULT' }}</span>
          </div>
        </div>

        <!-- Section 1: Detailed Rx Grid per Eye (OD & OS) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>👓 Lens Prescription Parameters</span>
            </h3>
            <span class="text-[11px] text-slate-500 font-mono">Units in Diopters (D) & Millimeters (mm)</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-center border-collapse text-xs">
              <thead>
                <tr class="bg-slate-100 text-slate-700 font-bold border-y border-slate-200">
                  <th class="py-2 px-2 text-left">Eye</th>
                  <th class="py-2 px-2">SPH</th>
                  <th class="py-2 px-2">CYL</th>
                  <th class="py-2 px-2">Axis</th>
                  <th class="py-2 px-2">ADD</th>
                  <th class="py-2 px-2">Dia (Ø)</th>
                  <th class="py-2 px-2">DPD</th>
                  <th class="py-2 px-2">NPD</th>
                  <th class="py-2 px-2">H.Prism</th>
                  <th class="py-2 px-2">V.Prism</th>
                  <th class="py-2 px-2">FH</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 font-mono">
                <!-- Right Eye (OD) -->
                <tr :class="odItem ? 'bg-indigo-50/30' : ''">
                  <td class="py-2.5 px-2 text-left font-sans font-extrabold text-indigo-700">OD (Right)</td>
                  <td class="py-2.5 px-2 font-bold">{{ formatDiopter(odItem?.sphere) }}</td>
                  <td class="py-2.5 px-2 font-bold">{{ formatDiopter(odItem?.cylinder) }}</td>
                  <td class="py-2.5 px-2">{{ odItem?.axis ? odItem.axis + '°' : '-' }}</td>
                  <td class="py-2.5 px-2 text-emerald-700 font-bold">{{ odItem?.addition ? '+' + odItem.addition.toFixed(2) : '-' }}</td>
                  <td class="py-2.5 px-2">{{ odItem?.diameter || 70 }}mm</td>
                  <td class="py-2.5 px-2">{{ odItem?.dpd || order.frame?.pdFarR || '-' }}</td>
                  <td class="py-2.5 px-2">{{ odItem?.npd || order.frame?.pdNearR || '-' }}</td>
                  <td class="py-2.5 px-2">{{ odItem?.hPrism ? odItem.hPrism + 'Δ ' + (odItem.hBase || '') : '-' }}</td>
                  <td class="py-2.5 px-2">{{ odItem?.vPrism ? odItem.vPrism + 'Δ ' + (odItem.vBase || '') : '-' }}</td>
                  <td class="py-2.5 px-2 font-bold">{{ odItem?.fh || order.frame?.heightR || '-' }}</td>
                </tr>

                <!-- Left Eye (OS) -->
                <tr :class="osItem ? 'bg-sky-50/30' : ''">
                  <td class="py-2.5 px-2 text-left font-sans font-extrabold text-sky-700">OS (Left)</td>
                  <td class="py-2.5 px-2 font-bold">{{ formatDiopter(osItem?.sphere) }}</td>
                  <td class="py-2.5 px-2 font-bold">{{ formatDiopter(osItem?.cylinder) }}</td>
                  <td class="py-2.5 px-2">{{ osItem?.axis ? osItem.axis + '°' : '-' }}</td>
                  <td class="py-2.5 px-2 text-emerald-700 font-bold">{{ osItem?.addition ? '+' + osItem.addition.toFixed(2) : '-' }}</td>
                  <td class="py-2.5 px-2">{{ osItem?.diameter || 70 }}mm</td>
                  <td class="py-2.5 px-2">{{ osItem?.dpd || order.frame?.pdFarL || '-' }}</td>
                  <td class="py-2.5 px-2">{{ osItem?.npd || order.frame?.pdNearL || '-' }}</td>
                  <td class="py-2.5 px-2">{{ osItem?.hPrism ? osItem.hPrism + 'Δ ' + (osItem.hBase || '') : '-' }}</td>
                  <td class="py-2.5 px-2">{{ osItem?.vPrism ? osItem.vPrism + 'Δ ' + (osItem.vBase || '') : '-' }}</td>
                  <td class="py-2.5 px-2 font-bold">{{ osItem?.fh || order.frame?.heightL || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 2: Frame Measurements & Trace Specs -->
        <div v-if="order.frame" class="space-y-2">
          <div class="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>📐 Frame Measurements & Optical Angles</span>
            </h3>
            <span class="text-[11px] text-slate-600 font-semibold">Type: {{ order.frame.frameType || 'Metal Fullrim' }} | Shape: {{ order.frame.frameShape || 'Standard' }}</span>
          </div>

          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
            <div class="p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[10px] font-bold text-slate-400 font-sans block">A (Width)</span>
              <span class="font-extrabold text-slate-900">{{ order.frame.frameWidthA || '-' }} mm</span>
            </div>
            <div class="p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[10px] font-bold text-slate-400 font-sans block">B (Height)</span>
              <span class="font-extrabold text-slate-900">{{ order.frame.frameHeightB || '-' }} mm</span>
            </div>
            <div class="p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[10px] font-bold text-slate-400 font-sans block">ED (Dia)</span>
              <span class="font-extrabold text-slate-900">{{ order.frame.effectiveDiaEd || '-' }} mm</span>
            </div>
            <div class="p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[10px] font-bold text-slate-400 font-sans block">DBL (Bridge)</span>
              <span class="font-extrabold text-slate-900">{{ order.frame.noseBridgeDbl || '-' }} mm</span>
            </div>
            <div class="p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[10px] font-bold text-slate-400 font-sans block">Pantoscopic Tilt</span>
              <span class="font-extrabold text-slate-900">{{ order.frame.pantoscopicTilt ? order.frame.pantoscopicTilt + '°' : '-' }}</span>
            </div>
            <div class="p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span class="text-[10px] font-bold text-slate-400 font-sans block">Face Form / Wrap</span>
              <span class="font-extrabold text-slate-900">{{ order.frame.faceFormAngle ? order.frame.faceFormAngle + '°' : '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Section 3: Lens Product, Materials, Treatments -->
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-bold text-slate-900">
              Product: {{ order.lensItems?.[0]?.productName || 'Optical Prescription Lens' }}
            </span>
            <div class="flex items-center gap-1.5 text-[10px]">
              <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold font-mono">
                Index {{ order.lensItems?.[0]?.refractiveIndex || '1.60' }}
              </span>
              <span class="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold">
                {{ order.lensItems?.[0]?.material || 'CR-39 Plastic' }}
              </span>
              <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                {{ order.lensItems?.[0]?.coating || 'Super HMC' }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/80">
            <div>
              <span class="text-slate-500 font-medium">Treatments: </span>
              <strong class="text-slate-800">{{ order.lensItems?.[0]?.treatments || 'Anti-Glare, Scratch Resistant, UV420' }}</strong>
            </div>
            <div>
              <span class="text-slate-500 font-medium">Tinting: </span>
              <strong class="text-slate-800">
                {{ order.lensItems?.[0]?.tintingType !== 'None' ? order.lensItems?.[0]?.tintingType + ' (' + (order.lensItems?.[0]?.tintColor || '') + ' ' + (order.lensItems?.[0]?.tintFrom || '') + ')' : 'Clear (No Tint)' }}
              </strong>
            </div>
          </div>

          <div v-if="order.notes" class="pt-1 text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
            <strong>Lab Special Instructions:</strong> {{ order.notes }}
          </div>
        </div>

        <!-- Section 4: Optical Technician Checkpoint Sign-off Grid -->
        <div class="pt-2 border-t border-slate-200">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Lab Surfacing & Inspection Checkpoints</span>
          <div class="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
            <div class="border border-slate-200 p-2 rounded-xl bg-white">
              <span class="block text-slate-500">1. Generator</span>
              <span class="block text-slate-300 mt-2">Sign: _______</span>
            </div>
            <div class="border border-slate-200 p-2 rounded-xl bg-white">
              <span class="block text-slate-500">2. Polisher</span>
              <span class="block text-slate-300 mt-2">Sign: _______</span>
            </div>
            <div class="border border-slate-200 p-2 rounded-xl bg-white">
              <span class="block text-slate-500">3. AR Chamber</span>
              <span class="block text-slate-300 mt-2">Sign: _______</span>
            </div>
            <div class="border border-slate-200 p-2 rounded-xl bg-white">
              <span class="block text-slate-500">4. Edger & Bevel</span>
              <span class="block text-slate-300 mt-2">Sign: _______</span>
            </div>
            <div class="border border-slate-200 p-2 rounded-xl bg-white">
              <span class="block text-slate-500">5. Final QC</span>
              <span class="block text-slate-300 mt-2">Sign: _______</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Printer, X } from 'lucide-vue-next';
import type { UnifiedLensOrder } from '@/services/lens.service';

const props = defineProps<{
  isOpen: boolean;
  order: UnifiedLensOrder | null;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const odItem = computed(() => {
  return props.order?.lensItems?.find((i) => i.eyeSide === 'Right') || props.order?.lensItems?.[0];
});

const osItem = computed(() => {
  return props.order?.lensItems?.find((i) => i.eyeSide === 'Left') || props.order?.lensItems?.[1] || props.order?.lensItems?.[0];
});

function formatDiopter(val?: number | null) {
  if (val === undefined || val === null) return '-';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(2)}`;
}

function triggerPrint() {
  window.print();
}
</script>
