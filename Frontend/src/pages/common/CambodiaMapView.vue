<template>
  <div class="space-y-6">
    <!-- Page Header Banner -->
    <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
          <MapPin class="w-3.5 h-3.5" />
          <span>Nationwide Cambodia Optical Logistics & Store Directory</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Cambodia Optical Network Map
        </h1>
        <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
          Real geographic tracking and locator for Platform Headquarters, authorized Optical Wholesalers, and Retail Boutiques across Cambodia.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <router-link
          to="/register"
          class="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/30 transition-all flex items-center gap-1.5"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Register New Store / Wholesaler</span>
        </router-link>
      </div>
    </div>

    <!-- Real Cambodia Map Component -->
    <RealCambodiaMap />
  </div>
</template>

<script setup lang="ts">
import { MapPin, Plus } from 'lucide-vue-next';
import RealCambodiaMap from '@/components/common/RealCambodiaMap.vue';
</script>
