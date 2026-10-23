<template>
  <div class="space-y-6">
    <!-- Header & Action Buttons -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/30">
          <Glasses class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Frame Platform
            <span class="text-xs px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold">
              Optical Spec & Boxing System
            </span>
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            Manage single & group optical frames, accessories, visual shapes, and color-variant stock distributions
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap items-center gap-2.5">
        <button
          @click="seedOlevaDemo"
          class="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          title="Seed Oleva OLV1201 Wireframe Demo"
        >
          <Sparkles class="w-4 h-4 text-amber-500" />
          <span>Demo Data</span>
        </button>

        <button
          @click="openAddModal('SINGLE')"
          class="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition"
        >
          <Plus class="w-4 h-4 text-sky-400" />
          <span>+ Add Single Frame</span>
        </button>

        <button
          @click="openAddModal('GROUP')"
          class="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/30 flex items-center gap-2 transition"
        >
          <Layers class="w-4 h-4" />
          <span>+ Add Group Frames</span>
        </button>
      </div>
    </div>

    <!-- Stats KPI Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
          <Glasses class="w-5 h-5" />
        </div>
        <div>
          <span class="text-[11px] font-bold text-slate-400 block uppercase">Total Frames</span>
          <span class="text-xl font-extrabold text-slate-900">{{ stats.totalFrames }}</span>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
          <Layers class="w-5 h-5" />
        </div>
        <div>
          <span class="text-[11px] font-bold text-slate-400 block uppercase">Group Frames</span>
          <span class="text-xl font-extrabold text-purple-700">{{ stats.groupFrames }}</span>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <Boxes class="w-5 h-5" />
        </div>
        <div>
          <span class="text-[11px] font-bold text-slate-400 block uppercase">Total Units Stock</span>
          <span class="text-xl font-extrabold text-emerald-600">{{ stats.totalQuantity }}</span>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <SunMedium class="w-5 h-5" />
        </div>
        <div>
          <span class="text-[11px] font-bold text-slate-400 block uppercase">Categories</span>
          <span class="text-xl font-extrabold text-amber-600">{{ stats.categories?.length || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div class="flex flex-col md:flex-row md:items-center gap-3">
        <!-- Search Input -->
        <div class="relative flex-1">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            v-model="filters.search"
            @input="debounceFetch"
            type="text"
            placeholder="Search by brand (Oleva), model (OLV1201), code (C4), or specs..."
            class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 font-medium"
          />
        </div>

        <!-- Mode Filter -->
        <select
          v-model="filters.entryType"
          @change="fetchFrames"
          class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
        >
          <option value="">All Modes</option>
          <option value="SINGLE">Single Frame</option>
          <option value="GROUP">Group Frames</option>
        </select>

        <!-- Gender Filter -->
        <select
          v-model="filters.gender"
          @change="fetchFrames"
          class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
        >
          <option value="All">All Genders</option>
          <option value="Woman">Woman</option>
          <option value="Man">Man</option>
          <option value="Kid">Kid</option>
          <option value="Unisex">Unisex</option>
        </select>

        <!-- Frame Shape Filter -->
        <select
          v-model="filters.frameShape"
          @change="fetchFrames"
          class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
        >
          <option value="All">All Shapes</option>
          <option value="Rectangle">Rectangle</option>
          <option value="Oval">Oval</option>
          <option value="Round">Round</option>
          <option value="Wellington">Wellington</option>
          <option value="Boston">Boston</option>
          <option value="Browline">Browline</option>
          <option value="Rimless">Rimless</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span class="text-slate-400 font-bold text-[11px] uppercase mr-1 shrink-0">Category:</span>
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectCategory(cat)"
          :class="[
            'px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all text-xs shrink-0',
            filters.category === cat
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Frames Cards / Table View -->
    <div class="space-y-4">
      <div v-if="loading" class="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
        <Glasses class="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2" />
        <p class="font-bold text-sm">Loading frames...</p>
      </div>

      <div v-else-if="frames.length === 0" class="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
        <Glasses class="w-12 h-12 mx-auto text-slate-300 mb-2" />
        <p class="font-bold text-sm text-slate-600">No frames found matching your criteria</p>
        <p class="text-xs text-slate-400 mt-1">Click "+ Add Single Frame" or "+ Add Group Frames" to create a new model</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="frame in frames"
          :key="frame.id"
          class="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
        >
          <!-- Card Header & Badge -->
          <div class="p-5 pb-3">
            <div class="flex items-start justify-between gap-2 mb-2">
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-sky-600">
                  {{ frame.brand }}
                </span>
                <h3 class="text-lg font-black text-slate-900 leading-tight">
                  {{ frame.model }}
                </h3>
              </div>

              <div class="flex items-center gap-1.5">
                <span
                  class="text-[11px] font-bold px-2 py-0.5 rounded-lg border"
                  :class="frame.entryType === 'GROUP' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-700 border-slate-200'"
                >
                  {{ frame.entryType === 'GROUP' ? 'Group' : 'Single' }}
                </span>
                <span
                  v-if="frame.isPolarized"
                  class="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-md border border-amber-200 flex items-center gap-0.5"
                  title="Polarized Lens"
                >
                  <SunMedium class="w-3 h-3" /> Polarize
                </span>
              </div>
            </div>

            <!-- Frame Picture Preview -->
            <div class="relative w-full h-40 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center p-2 mb-3">
              <img
                :src="frame.pictures?.[0]?.url || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'"
                class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <!-- Quantity badge -->
              <span class="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-900/80 text-white rounded-lg text-xs font-mono font-bold backdrop-blur-xs">
                Qty: {{ frame.quantity }}
              </span>
            </div>

            <!-- Group Frame Code Distribution Badges [C1:20][C2:20][C3:20][C4:40] -->
            <div v-if="frame.entryType === 'GROUP' && frame.variants?.length" class="mb-3">
              <span class="text-[10px] font-bold text-slate-400 block mb-1">Color Variant Breakdown:</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="v in frame.variants"
                  :key="v.code"
                  class="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200"
                >
                  [{{ v.code }}:{{ v.quantity }}]
                </span>
              </div>
            </div>

            <!-- Single Frame Code -->
            <div v-else-if="frame.code" class="mb-3 flex items-center gap-2">
              <span class="text-[10px] font-bold text-slate-400">Color Code:</span>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                {{ frame.code }}
              </span>
            </div>

            <!-- Boxing System & Optical Specs -->
            <div class="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-xs space-y-1.5 mb-3">
              <div class="flex items-center justify-between font-mono">
                <span class="text-slate-500 font-bold">Boxing:</span>
                <span class="font-extrabold text-slate-900">{{ frame.boxingNotation || '52 ▢ 17 – 147' }}</span>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-500">
                <span>A: {{ frame.lensWidthA || 52 }} | B: {{ frame.lensHeightB || 38 }} | ED: {{ frame.effectiveDiaEd || 58 }}</span>
                <span class="font-bold text-sky-700">Size: {{ frame.frameSize || 'M' }}</span>
              </div>
            </div>

            <!-- Attributes Pills: Category, Shape, Material, Type -->
            <div class="flex flex-wrap gap-1 text-[11px]">
              <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold">
                {{ frame.category }}
              </span>
              <span v-if="frame.frameShape" class="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md font-bold">
                {{ frame.frameShape }}
              </span>
              <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                {{ frame.type }}
              </span>
              <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                {{ frame.material }}
              </span>
            </div>

            <!-- Included Accessories Count -->
            <div v-if="frame.accessories?.length" class="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
              <PackageCheck class="w-3.5 h-3.5 text-emerald-600" />
              <span>Accessories:</span>
              <span class="font-bold text-slate-700">
                {{ frame.accessories.filter(a => a.isIncluded).map(a => a.name).join(', ') }}
              </span>
            </div>
          </div>

          <!-- Card Footer with Pricing & Delete -->
          <div class="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-slate-400 font-semibold block">Wholesale Price</span>
              <span class="text-base font-black text-slate-900">${{ frame.wholesalePrice?.toFixed(2) }}</span>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="deleteFrame(frame.id)"
                class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                title="Delete frame"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Frame Modal Component -->
    <AddFrameModal
      :isOpen="showModal"
      :initialMode="modalMode"
      @close="showModal = false"
      @saved="handleFrameSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import {
  Glasses,
  Plus,
  Layers,
  Sparkles,
  Boxes,
  SunMedium,
  Search,
  Trash2,
  PackageCheck,
} from 'lucide-vue-next';
import AddFrameModal from '@/components/frames/AddFrameModal.vue';
import { frameService } from '@/services/frame.service';
import type { FrameItem } from '@/types/frame';

const loading = ref(false);
const frames = ref<FrameItem[]>([]);
const stats = reactive({
  totalFrames: 0,
  singleFrames: 0,
  groupFrames: 0,
  totalQuantity: 0,
  categories: [] as any[],
});

const showModal = ref(false);
const modalMode = ref<'SINGLE' | 'GROUP'>('SINGLE');

const categories = [
  'All',
  'Eyeglasses',
  'Eyeglasses Clip',
  'Sunglasses',
  'Reading Glasses',
  'Sportive',
  'Safety',
  'Others',
];

const filters = reactive({
  search: '',
  category: 'All',
  gender: 'All',
  frameShape: 'All',
  entryType: '',
});

let debounceTimer: any = null;
function debounceFetch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchFrames();
  }, 300);
}

function selectCategory(cat: string) {
  filters.category = cat;
  fetchFrames();
}

function openAddModal(mode: 'SINGLE' | 'GROUP') {
  modalMode.value = mode;
  showModal.value = true;
}

async function fetchStats() {
  try {
    const data = await frameService.getStats();
    stats.totalFrames = data.totalFrames || 0;
    stats.singleFrames = data.singleFrames || 0;
    stats.groupFrames = data.groupFrames || 0;
    stats.totalQuantity = data.totalQuantity || 0;
    stats.categories = data.categories || [];
  } catch (err) {
    console.error('Failed to load frame stats:', err);
  }
}

async function fetchFrames() {
  loading.value = true;
  try {
    const res = await frameService.getFrames({
      search: filters.search || undefined,
      category: filters.category,
      gender: filters.gender,
      frameShape: filters.frameShape,
      entryType: filters.entryType || undefined,
    });
    frames.value = res.data || [];
  } catch (err) {
    console.error('Failed to load frames:', err);
  } finally {
    loading.value = false;
  }
}

async function seedOlevaDemo() {
  try {
    await frameService.seedDemo();
    await fetchFrames();
    await fetchStats();
  } catch (err: any) {
    alert(err.message || 'Failed to seed demo');
  }
}

async function deleteFrame(id: string) {
  if (confirm('Are you sure you want to delete this frame?')) {
    try {
      await frameService.deleteFrame(id);
      await fetchFrames();
      await fetchStats();
    } catch (err: any) {
      alert(err.message || 'Failed to delete frame');
    }
  }
}

function handleFrameSaved() {
  fetchFrames();
  fetchStats();
}

onMounted(() => {
  fetchStats();
  fetchFrames();
});
</script>
