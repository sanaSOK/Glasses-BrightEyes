<template>
  <div class="flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer select-none group"
       :class="[
         isSelected
           ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/20 text-sky-950 shadow-sm'
           : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-700'
       ]">
    <!-- Vector Optical Glasses Silhouette -->
    <div class="w-16 h-8 flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105">
      <!-- 1. Rectangle -->
      <svg v-if="shape === 'Rectangle'" viewBox="0 0 100 40" class="w-full h-full stroke-current fill-none stroke-[2.2]">
        <!-- Left Lens -->
        <rect x="5" y="10" width="38" height="22" rx="4" />
        <!-- Right Lens -->
        <rect x="57" y="10" width="38" height="22" rx="4" />
        <!-- Bridge -->
        <path d="M43 18 C 47 15, 53 15, 57 18" />
        <!-- Temples -->
        <line x1="5" y1="14" x2="1" y2="14" />
        <line x1="95" y1="14" x2="99" y2="14" />
      </svg>

      <!-- 2. Oval -->
      <svg v-else-if="shape === 'Oval'" viewBox="0 0 100 40" class="w-full h-full stroke-current fill-none stroke-[2.2]">
        <ellipse cx="25" cy="20" rx="19" ry="12" />
        <ellipse cx="75" cy="20" rx="19" ry="12" />
        <path d="M44 19 C 48 16, 52 16, 56 19" />
        <line x1="6" y1="18" x2="2" y2="18" />
        <line x1="94" y1="18" x2="98" y2="18" />
      </svg>

      <!-- 3. Round -->
      <svg v-else-if="shape === 'Round'" viewBox="0 0 100 40" class="w-full h-full stroke-current fill-none stroke-[2.2]">
        <circle cx="25" cy="21" r="14" />
        <circle cx="75" cy="21" r="14" />
        <path d="M39 19 C 45 16, 55 16, 61 19" />
        <line x1="11" y1="19" x2="5" y2="19" />
        <line x1="89" y1="19" x2="95" y2="19" />
      </svg>

      <!-- 4. Wellington -->
      <svg v-else-if="shape === 'Wellington'" viewBox="0 0 100 40" class="w-full h-full stroke-current fill-none stroke-[2.2]">
        <path d="M 6 11 L 43 11 C 41 26, 36 30, 24 30 C 12 30, 8 26, 6 11 Z" />
        <path d="M 57 11 L 94 11 C 92 26, 88 30, 76 30 C 64 30, 59 26, 57 11 Z" />
        <path d="M 43 15 C 47 13, 53 13, 57 15" />
        <line x1="6" y1="13" x2="2" y2="13" />
        <line x1="94" y1="13" x2="98" y2="13" />
      </svg>

      <!-- 5. Boston -->
      <svg v-else-if="shape === 'Boston'" viewBox="0 0 100 40" class="w-full h-full stroke-current fill-none stroke-[2.2]">
        <!-- Rounded inverted egg / panto -->
        <path d="M 8 13 C 12 11, 38 11, 42 13 C 44 26, 35 32, 25 32 C 14 32, 6 26, 8 13 Z" />
        <path d="M 58 13 C 62 11, 88 11, 92 13 C 94 26, 86 32, 75 32 C 65 32, 56 26, 58 13 Z" />
        <path d="M 42 16 C 47 12, 53 12, 58 16" />
        <line x1="8" y1="15" x2="3" y2="15" />
        <line x1="92" y1="15" x2="97" y2="15" />
      </svg>

      <!-- 6. Browline -->
      <svg v-else-if="shape === 'Browline'" viewBox="0 0 100 40" class="w-full h-full fill-none">
        <!-- Heavy top rim -->
        <path d="M 5 11 C 12 9, 36 9, 43 12 L 41 15 C 34 13, 14 13, 7 15 Z" fill="currentColor" />
        <path d="M 57 12 C 64 9, 88 9, 95 11 L 93 15 C 86 13, 66 13, 59 15 Z" fill="currentColor" />
        <!-- Thin bottom wire -->
        <path d="M 7 15 C 9 27, 21 31, 31 31 C 38 31, 41 26, 41 15" class="stroke-current stroke-[1.5]" />
        <path d="M 59 15 C 59 26, 62 31, 69 31 C 79 31, 91 27, 93 15" class="stroke-current stroke-[1.5]" />
        <!-- Metal Bridge -->
        <path d="M 43 16 C 47 13, 53 13, 57 16" class="stroke-current stroke-[2]" />
      </svg>

      <!-- 7. Rimless -->
      <svg v-else-if="shape === 'Rimless'" viewBox="0 0 100 40" class="w-full h-full stroke-current fill-none stroke-[1.5] stroke-dasharray-[2_2]">
        <rect x="7" y="11" width="36" height="20" rx="5" class="stroke-[1.3] stroke-slate-400 stroke-dashed" />
        <rect x="57" y="11" width="36" height="20" rx="5" class="stroke-[1.3] stroke-slate-400 stroke-dashed" />
        <!-- Solid mount screws & bridge -->
        <circle cx="41" cy="19" r="1.5" class="fill-current stroke-none" />
        <circle cx="59" cy="19" r="1.5" class="fill-current stroke-none" />
        <path d="M 41 19 C 46 16, 54 16, 59 19" class="stroke-current stroke-[2.2] stroke-solid" />
        <line x1="7" y1="16" x2="2" y2="16" class="stroke-current stroke-[2.2] stroke-solid" />
        <line x1="93" y1="16" x2="98" y2="16" class="stroke-current stroke-[2.2] stroke-solid" />
      </svg>

      <!-- 8. Other (Geometric / Hexagon) -->
      <svg v-else viewBox="0 0 100 40" class="w-full h-full stroke-current fill-none stroke-[2.2]">
        <polygon points="12,11 36,11 44,20 36,30 12,30 4,20" />
        <polygon points="64,11 88,11 96,20 88,30 64,30 56,20" />
        <path d="M 44 19 C 48 16, 52 16, 56 19" />
        <line x1="4" y1="19" x2="0" y2="19" />
        <line x1="96" y1="19" x2="100" y2="19" />
      </svg>
    </div>

    <!-- Label -->
    <span class="text-xs font-semibold tracking-tight text-center truncate w-full"
          :class="isSelected ? 'text-sky-700 font-bold' : 'text-slate-600'">
      {{ shape }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { FrameShape } from '@/types/frame';

defineProps<{
  shape: FrameShape;
  isSelected?: boolean;
}>();
</script>
