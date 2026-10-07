<template>
  <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300">
    <div class="flex items-center justify-between mb-4">
      <span class="text-sm font-medium text-slate-500 tracking-wide">{{ title }}</span>
      <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', iconBgClass]">
        <component :is="icon" :class="['w-6 h-6', iconColorClass]" />
      </div>
    </div>
    <div class="flex items-baseline justify-between">
      <span class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ value }}</span>
      <span v-if="subtext" class="text-xs font-semibold text-slate-500">{{ subtext }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  title: string;
  value: string | number;
  icon: Component;
  iconBgClass?: string;
  iconColorClass?: string;
  subtext?: string;
}>();
</script>
