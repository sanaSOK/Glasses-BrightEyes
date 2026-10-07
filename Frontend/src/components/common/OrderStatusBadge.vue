<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider border',
      styleConfig.bg,
      styleConfig.text,
      styleConfig.border
    ]"
  >
    <component :is="styleConfig.icon" class="w-3.5 h-3.5" />
    {{ formatStatus(status) }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { OrderStatus } from '@/types';
import {
  Clock,
  CheckCircle2,
  PackageCheck,
  Truck,
  CheckCheck,
  XCircle,
  AlertTriangle,
} from 'lucide-vue-next';

const props = defineProps<{
  status: OrderStatus;
}>();

const formatStatus = (st: string) => {
  return st.replace(/_/g, ' ');
};

const styleConfig = computed(() => {
  switch (props.status) {
    case 'PENDING':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock };
    case 'CONFIRMED':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: CheckCircle2 };
    case 'PROCESSING':
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: PackageCheck };
    case 'READY_FOR_DELIVERY':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Truck };
    case 'SHIPPED':
      return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', icon: Truck };
    case 'DELIVERED':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCheck };
    case 'CANCELLED':
      return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: XCircle };
    case 'REJECTED':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: AlertTriangle };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: Clock };
  }
});
</script>
