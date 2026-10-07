<script setup lang="ts">
import { ref } from 'vue';
import { ArrowUpRight, Glasses, Sun, Eye, Disc, Wrench } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import contactLensImg from '@/assets/contact-lenses.png';
import optometricMachineryImg from '@/assets/optometric-machinery.png';
import opticalLensesImg from '@/assets/optical-lenses.png';

export interface ElasticGalleryItem {
  id: string;
  title: string;
  category: string;
  src: string;
  alt: string;
  description?: string;
  link?: string;
  icon?: any;
}

const props = withDefaults(
  defineProps<{
    items?: ElasticGalleryItem[];
    defaultActiveId?: string;
  }>(),
  {
    defaultActiveId: '04',
  }
);

const defaultOpticalItems: ElasticGalleryItem[] = [
  {
    id: '01',
    title: 'Eyeglass Frames',
    category: 'Prescription Frames',
    src: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80',
    alt: 'Premium Titanium & Acetate Eyeglass Frames',
    description: 'Designer optical frames including acetate, titanium, rimless, and memory metal for optical retailers.',
    icon: Glasses,
  },
  {
    id: '02',
    title: 'Sunglasses',
    category: 'UV400 & Polarized',
    src: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
    alt: 'Fashion Polarized & UV Protection Sunglasses',
    description: 'High-end UV400 polarized shades, fashion aviators, oversized frames, and sport sunglasses.',
    icon: Sun,
  },
  {
    id: '03',
    title: 'Contact Lenses',
    category: 'Daily & Monthly Soft Lenses',
    src: contactLensImg,
    alt: 'Soft Contact Lenses on reflective surface with water drops',
    description: 'Hydrating daily disposable, monthly silicone hydrogel, toric, and cosmetic color contact lenses.',
    icon: Eye,
  },
  {
    id: '04',
    title: 'Optical Lenses',
    category: 'Single Vision & Progressive',
    src: opticalLensesImg,
    alt: 'Precision Ophthalmic Lenses Blanks',
    description: '1.56 to 1.74 high index lenses, anti-blue light, photochromic, and freeform progressive optics.',
    icon: Disc,
  },
  {
    id: '05',
    title: 'Optometric Machinery',
    category: 'Diagnostic & Workshop Equipment',
    src: optometricMachineryImg,
    alt: 'Professional Diagnostic & Optometric Machinery Suite',
    description: 'Auto refractometers, digital lensmeters, computerized chart projectors, and optical lab edgers.',
    icon: Wrench,
  },
];

const galleryItems = props.items && props.items.length > 0 ? props.items : defaultOpticalItems;
const activeId = ref<string>(props.defaultActiveId || galleryItems[0].id);
</script>

<template>
  <div class="w-full py-8 md:py-12">
    <!-- Container: Fixed height on mobile/desktop to ensure animation stability -->
    <div class="mx-auto flex h-[520px] w-full max-w-7xl flex-col gap-3 px-2 md:h-[620px] md:flex-row md:gap-4">
      <div
        v-for="item in galleryItems"
        :key="item.id"
        @mouseenter="activeId = item.id"
        @click="activeId = item.id"
        :class="cn(
          'relative cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]',
          activeId === item.id ? 'flex-[4] brightness-100 ring-2 ring-sky-500/50 shadow-sky-500/20' : 'flex-[1] brightness-50 hover:brightness-90 hover:border-slate-700'
        )"
      >
        <!-- Background Image Layer -->
        <div class="absolute inset-0 h-full w-full overflow-hidden">
          <img
            :src="item.src"
            :alt="item.alt"
            :class="cn(
              'h-full w-full object-cover transition-transform duration-1000 ease-out',
              activeId === item.id ? 'scale-100' : 'scale-110 group-hover:scale-105'
            )"
          />
          <!-- Gradient Overlay for Text Readability -->
          <div
            :class="cn(
              'absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/10 transition-opacity duration-500',
              activeId === item.id ? 'opacity-95' : 'opacity-70'
            )"
          />
        </div>

        <!-- --- Content Container --- -->
        <div class="absolute bottom-0 left-0 right-0 flex h-full flex-col justify-end p-5 md:p-8 z-10 pointer-events-none">
          <!-- Active Content: Title, Category, Description & Button -->
          <div
            :class="cn(
              'flex flex-col gap-3 transition-all duration-500 pointer-events-auto',
              activeId === item.id
                ? 'translate-y-0 opacity-100 delay-150'
                : 'translate-y-12 opacity-0 pointer-events-none'
            )"
          >
            <!-- Category Tag with Glow & Icon -->
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-950/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300 backdrop-blur-md shadow-lg shadow-sky-500/20">
                <component v-if="item.icon" :is="item.icon" class="w-3.5 h-3.5 text-sky-400" />
                {{ item.category }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-tight text-white tracking-tight drop-shadow-md">
              {{ item.title }}
            </h3>

            <!-- Description -->
            <p v-if="item.description" class="text-xs sm:text-sm text-slate-300 max-w-xl line-clamp-2 leading-relaxed font-normal">
              {{ item.description }}
            </p>

            <!-- Call to Action Button -->
            <div class="mt-2 flex items-center gap-3">
              <router-link
                to="/login"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-sky-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Browse Wholesale Catalog</span>
                <ArrowUpRight class="h-4 w-4" />
              </router-link>
            </div>
          </div>

          <!-- Inactive Content: Vertical Text (Desktop) / Short Label (Mobile) -->
          <div
            :class="cn(
              'absolute transition-all duration-500 pointer-events-none',
              'bottom-6 left-1/2 -translate-x-1/2 md:bottom-10',
              activeId === item.id
                ? 'opacity-0 scale-50'
                : 'opacity-100 delay-300'
            )"
          >
            <!-- Desktop: Vertical Rotated Category Name -->
            <div class="hidden whitespace-nowrap text-lg font-extrabold uppercase tracking-widest text-slate-200 [writing-mode:vertical-rl] md:flex items-center gap-3 drop-shadow-lg">
              <component v-if="item.icon" :is="item.icon" class="w-4 h-4 text-sky-400 rotate-90" />
              <span>{{ item.title }}</span>
            </div>

            <!-- Mobile: Horizontal ID & Short Label -->
            <div class="flex items-center gap-1.5 text-xs font-black text-sky-300 md:hidden bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800 backdrop-blur-md">
              <span>{{ item.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
