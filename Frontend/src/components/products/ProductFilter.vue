<template>
  <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
    <!-- Search Bar -->
    <div class="relative">
      <Search class="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
      <input
        v-model="searchQuery"
        @input="onSearchInput"
        type="text"
        placeholder="Search by product name, SKU, brand, or model..."
        class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      <!-- Category Filter -->
      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1">Category</label>
        <select
          v-model="selectedCategory"
          @change="emitChange"
          class="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Product Type Filter -->
      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1">Product Type</label>
        <select
          v-model="selectedType"
          @change="emitChange"
          class="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500"
        >
          <option value="">All Types</option>
          <option value="FRAME">Eyeglass Frames</option>
          <option value="SUNGLASSES">Sunglasses</option>
          <option value="CONTACT_LENS">Contact Lenses</option>
          <option value="OPTICAL_LENS">Optical Lenses</option>
          <option value="ACCESSORY">Accessories</option>
          <option value="EQUIPMENT">Equipment</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <!-- Brand Filter -->
      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1">Brand</label>
        <input
          v-model="selectedBrand"
          @change="emitChange"
          type="text"
          placeholder="e.g. Ray-Ban, Essilor"
          class="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500"
        />
      </div>

      <!-- In Stock Toggle -->
      <div class="flex items-end">
        <label class="flex items-center gap-2 cursor-pointer py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl w-full">
          <input
            type="checkbox"
            v-model="availableOnly"
            @change="emitChange"
            class="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
          />
          <span class="text-xs font-semibold text-slate-700">In-Stock Only</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ProductCategory, ProductType } from '@/types';
import { Search } from 'lucide-vue-next';

defineProps<{
  categories: ProductCategory[];
}>();

const emit = defineEmits(['filter-change']);

const searchQuery = ref('');
const selectedCategory = ref('');
const selectedType = ref<ProductType | ''>('');
const selectedBrand = ref('');
const availableOnly = ref(false);

let timeout: any = null;
const onSearchInput = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emitChange();
  }, 300);
};

const emitChange = () => {
  emit('filter-change', {
    search: searchQuery.value,
    category: selectedCategory.value,
    productType: selectedType.value || undefined,
    brand: selectedBrand.value,
    available: availableOnly.value,
  });
};
</script>
