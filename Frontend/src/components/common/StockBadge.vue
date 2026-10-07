<template>
  <div
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border transition-all',
      badgeStyle
    ]"
  >
    <span :class="['w-2 h-2 rounded-full animate-pulse', dotStyle]"></span>
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  availableQuantity?: number;
  lowStockThreshold?: number;
  status?: string;
}>();

const qty = computed(() => props.availableQuantity ?? 0);
const threshold = computed(() => props.lowStockThreshold ?? 10);

const computedStatus = computed(() => {
  if (props.status === 'OUT_OF_STOCK' || qty.value <= 0) return 'OUT_OF_STOCK';
  if (qty.value <= threshold.value) return 'LOW_STOCK';
  return 'IN_STOCK';
});

const label = computed(() => {
  if (computedStatus.value === 'OUT_OF_STOCK') return 'Out of Stock';
  if (computedStatus.value === 'LOW_STOCK') return `Low Stock (${qty.value} left)`;
  return `${qty.value} Available`;
});

const badgeStyle = computed(() => {
  switch (computedStatus.value) {
    case 'OUT_OF_STOCK':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'LOW_STOCK':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
});

const dotStyle = computed(() => {
  switch (computedStatus.value) {
    case 'OUT_OF_STOCK':
      return 'bg-rose-500';
    case 'LOW_STOCK':
      return 'bg-amber-500';
    default:
      return 'bg-emerald-500';
  }
});
</script>
