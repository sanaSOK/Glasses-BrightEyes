<template>
  <div v-if="product" class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
    <!-- Image Header with Stock Badge -->
    <div class="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center p-4">
      <img
        :src="primaryImageUrl"
        :alt="product.name"
        class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
      />
      <div class="absolute top-3 right-3">
        <StockBadge
          :availableQuantity="product.inventory?.availableQuantity"
          :lowStockThreshold="product.inventory?.lowStockThreshold"
          :status="product.status"
        />
      </div>
      <div class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase">
        {{ product.productType.replace('_', ' ') }}
      </div>
    </div>

    <!-- Product Content -->
    <div class="p-5 flex-1 flex flex-col justify-between">
      <div>
        <!-- Brand & SKU -->
        <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span class="font-bold text-sky-600 uppercase tracking-wider">{{ product.brand }}</span>
          <span class="font-mono text-slate-400">SKU: {{ product.SKU }}</span>
        </div>

        <!-- Name -->
        <h3 class="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-sky-600 transition-colors">
          {{ product.name }}
        </h3>

        <!-- Supplier & Spec details -->
        <p v-if="product.wholesaler" class="text-xs text-slate-500 mb-3 flex items-center gap-1">
          <Building2 class="w-3.5 h-3.5 text-slate-400" />
          <span class="truncate">{{ product.wholesaler.companyName }}</span>
        </p>

        <!-- Spec Pills -->
        <div class="flex flex-wrap gap-1.5 mb-4">
          <span v-if="product.material" class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
            {{ product.material }}
          </span>
          <span v-if="product.color" class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
            {{ product.color }}
          </span>
          <span v-if="product.size" class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
            {{ product.size }}
          </span>
        </div>
      </div>

      <!-- Pricing & Add to Cart -->
      <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span class="text-xs text-slate-400 block font-medium">Wholesale Price</span>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-extrabold text-slate-900">${{ product.wholesalePrice.toFixed(2) }}</span>
            <span class="text-xs text-slate-400 line-through">${{ product.price.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Add to Cart / Stock Action -->
        <button
          v-if="isRetailer"
          @click="$emit('add-to-cart', product)"
          :disabled="isOutOfStock || adding"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm',
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20 active:scale-95'
          ]"
        >
          <ShoppingCart class="w-4 h-4" />
          <span>{{ adding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '@/types';
import StockBadge from '@/components/common/StockBadge.vue';
import { ShoppingCart, Building2 } from 'lucide-vue-next';

const props = defineProps<{
  product: Product;
  isRetailer?: boolean;
  adding?: boolean;
}>();

defineEmits(['add-to-cart']);

const primaryImageUrl = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    const primary = props.product.images.find((img) => img.isPrimary);
    return primary ? primary.imageUrl : props.product.images[0].imageUrl;
  }
  return 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80';
});

const isOutOfStock = computed(() => {
  if (!props.product) return true;
  const inv = props.product.inventory;
  return (
    props.product.status === 'OUT_OF_STOCK' ||
    !inv ||
    inv.availableQuantity <= 0
  );
});
</script>
