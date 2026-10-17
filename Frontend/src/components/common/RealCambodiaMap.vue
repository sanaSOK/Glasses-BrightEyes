<template>
  <div class="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col font-sans">
    <!-- Header & Platform Statistics -->
    <div class="p-6 bg-slate-950 border-b border-slate-800">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin class="w-3.5 h-3.5 text-sky-400" />
            <span class="font-khmer">ផែនទីបណ្តាញផ្គត់ផ្គង់វ៉ែនតា កម្ពុជា</span>
            <span class="text-[10px] text-slate-400 font-normal">| Cambodia Optical Map</span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight flex flex-wrap items-center gap-2.5">
            <span class="font-khmer text-sky-300">ប្រព័ន្ធអេកូឡូស៊ីអុបទិក ព្រះរាជាណាចក្រកម្ពុជា</span>
            <span class="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              GPS Sync
            </span>
          </h3>
          <p class="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-khmer leading-relaxed">
            ស្វែងរកទីតាំងជាក់ស្តែងនៃទីស្នាក់ការកណ្តាល (Admin HQ) អ្នកនាំចូលលក់ដុំ (Wholesalers) និងហាងលក់រាយវ៉ែនតា (Retailers) ទូទាំង ២៥ រាជធានី-ខេត្ត។
          </p>
        </div>

        <!-- Quick Stats Badges -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            @click="setRoleFilter('ALL')"
            :class="[
              'px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer',
              store.selectedRoleFilter === 'ALL'
                ? 'bg-slate-800 border-sky-500/50 shadow-md ring-1 ring-sky-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            ]"
          >
            <div class="text-[10px] uppercase font-bold text-slate-400 font-khmer">ទីតាំងសរុប (All)</div>
            <div class="text-lg font-black text-white">{{ store.counts.total }}</div>
          </button>

          <button
            @click="setRoleFilter('ADMIN')"
            :class="[
              'px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer',
              store.selectedRoleFilter === 'ADMIN'
                ? 'bg-rose-950/60 border-rose-500 shadow-md ring-1 ring-rose-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-rose-900/40'
            ]"
          >
            <div class="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1 font-khmer">
              <ShieldAlert class="w-3 h-3" /> ទីស្នាក់ការ HQ
            </div>
            <div class="text-lg font-black text-rose-300">{{ store.counts.admin }}</div>
          </button>

          <button
            @click="setRoleFilter('WHOLESALER')"
            :class="[
              'px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer',
              store.selectedRoleFilter === 'WHOLESALER'
                ? 'bg-purple-950/60 border-purple-500 shadow-md ring-1 ring-purple-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-purple-900/40'
            ]"
          >
            <div class="text-[10px] uppercase font-bold text-purple-400 flex items-center gap-1 font-khmer">
              <Building2 class="w-3 h-3" /> អ្នកលក់ដុំ
            </div>
            <div class="text-lg font-black text-purple-300">{{ store.counts.wholesalers }}</div>
          </button>

          <button
            @click="setRoleFilter('RETAILER')"
            :class="[
              'px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer',
              store.selectedRoleFilter === 'RETAILER'
                ? 'bg-sky-950/60 border-sky-500 shadow-md ring-1 ring-sky-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-sky-900/40'
            ]"
          >
            <div class="text-[10px] uppercase font-bold text-sky-400 flex items-center gap-1 font-khmer">
              <Glasses class="w-3 h-3" /> ហាងលក់រាយ
            </div>
            <div class="text-lg font-black text-sky-300">{{ store.counts.retailers }}</div>
          </button>
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="mt-5 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <!-- Left: Role Filter Buttons -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 font-khmer">
          <button
            @click="setRoleFilter('ALL')"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
              store.selectedRoleFilter === 'ALL' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
            ]"
          >
            ទាំងអស់ ({{ store.counts.total }})
          </button>
          <button
            @click="setRoleFilter('ADMIN')"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
              store.selectedRoleFilter === 'ADMIN' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-rose-300'
            ]"
          >
            <span class="w-2 h-2 rounded-full bg-rose-400"></span>
            ទីស្នាក់ការកណ្តាល HQ
          </button>
          <button
            @click="setRoleFilter('WHOLESALER')"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
              store.selectedRoleFilter === 'WHOLESALER' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-purple-300'
            ]"
          >
            <span class="w-2 h-2 rounded-full bg-purple-400"></span>
            អ្នកលក់ដុំ ({{ store.counts.wholesalers }})
          </button>
          <button
            @click="setRoleFilter('RETAILER')"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
              store.selectedRoleFilter === 'RETAILER' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-sky-300'
            ]"
          >
            <span class="w-2 h-2 rounded-full bg-sky-400"></span>
            ហាងលក់រាយ ({{ store.counts.retailers }})
          </button>
        </div>

        <!-- Right: Search, Province Jump, Tile Switcher & Reset -->
        <div class="flex items-center flex-wrap gap-2.5">
          <!-- Province Dropdown (Khmer Names) -->
          <div class="relative">
            <select
              v-model="store.selectedProvince"
              @change="handleProvinceChange"
              class="appearance-none px-3 py-1.5 pr-8 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer font-khmer"
            >
              <option value="ALL">គ្រប់រាជធានី-ខេត្ត (All Provinces)</option>
              <option v-for="prov in CAMBODIA_PROVINCES" :key="prov.name" :value="prov.name">
                {{ prov.nameKhmer }} ({{ prov.nameEnglish }})
              </option>
            </select>
            <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <!-- Search Input -->
          <div class="relative">
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="store.searchQuery"
              type="text"
              placeholder="ស្វែងរកឈ្មោះហាង ផ្លូវ ឬខណ្ឌ..."
              class="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-48 sm:w-56 font-khmer"
            />
          </div>

          <!-- Layer Switcher Dropdown (No API Key Required) -->
          <div class="relative">
            <select
              v-model="tileTheme"
              @change="applyTileLayer"
              class="appearance-none px-2.5 py-1.5 pr-7 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer font-khmer"
            >
              <option value="street">🗺️ ផែនទីផ្លូវ (Street Map)</option>
              <option value="esri">🌐 ESRI Topo Map</option>
              <option value="satellite">🛰️ រូបភាពផ្កាយរណប (Satellite)</option>
              <option value="dark">🌙 Dark Mode</option>
            </select>
            <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <!-- Reset Cambodia View -->
          <button
            @click="resetCambodiaView"
            title="កំណត់ទិដ្ឋភាពកម្ពុជាឡើងវិញ"
            class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer font-khmer"
          >
            <Compass class="w-3.5 h-3.5 text-cyan-400" />
            <span>កម្ពុជា</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Map & Sidebar Split Layout -->
    <div class="relative flex-1 flex flex-col lg:flex-row h-[700px]">
      <!-- Left Directory Drawer -->
      <div class="w-full lg:w-80 bg-slate-950/95 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col h-56 lg:h-full z-10">
        <div class="p-3.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between font-khmer">
          <div class="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Building2 class="w-3.5 h-3.5 text-sky-400" />
            <span>បញ្ជីទីតាំង ({{ store.filteredLocations.length }})</span>
          </div>
          <span class="text-[10px] text-slate-500 font-semibold">ចុចដើម្បីស្វែងរក</span>
        </div>

        <div class="flex-1 overflow-y-auto divide-y divide-slate-800/50 p-2 space-y-1 custom-scrollbar">
          <div
            v-for="loc in store.filteredLocations"
            :key="loc.id"
            @click="flyToLocation(loc)"
            :class="[
              'p-2.5 rounded-xl cursor-pointer transition-all border text-left font-khmer',
              activeLocation?.id === loc.id
                ? 'bg-slate-800/90 border-sky-500/80 shadow-md'
                : 'bg-slate-900/40 border-transparent hover:bg-slate-900 hover:border-slate-800'
            ]"
          >
            <div class="flex items-start justify-between gap-2">
              <h4 class="text-xs font-bold text-white line-clamp-1">
                {{ loc.nameKhmer || loc.name }}
              </h4>
              <span
                :class="[
                  'text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider shrink-0',
                  loc.role === 'ADMIN'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : loc.role === 'WHOLESALER'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                ]"
              >
                {{ loc.role === 'ADMIN' ? 'HQ' : loc.role === 'WHOLESALER' ? 'លក់ដុំ' : 'លក់រាយ' }}
              </span>
            </div>

            <p class="text-[11px] text-slate-400 mt-1 line-clamp-1 flex items-center gap-1">
              <MapPin class="w-3 h-3 text-slate-500 shrink-0" />
              <span>{{ loc.districtKhmer || loc.district }}, {{ loc.provinceKhmer || getProvinceKhmer(loc.province) }}</span>
            </p>

            <div class="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
              <span>{{ loc.phone }}</span>
              <span v-if="loc.isCustom" class="text-emerald-400 font-bold font-khmer">ទើបចុះឈ្មោះ</span>
              <span v-else class="text-slate-400">{{ loc.lat.toFixed(4) }}, {{ loc.lng.toFixed(4) }}</span>
            </div>
          </div>

          <div v-if="store.filteredLocations.length === 0" class="p-6 text-center text-xs text-slate-500 font-khmer">
            មិនមានទិន្នន័យទីតាំងដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកទេ។
          </div>
        </div>
      </div>

      <!-- Real Leaflet Map Container -->
      <div class="flex-1 relative bg-slate-950 overflow-hidden min-h-[440px]">
        <div id="real-cambodia-map-canvas" class="w-full h-full z-0"></div>

        <!-- Legend Overlay in Corner -->
        <div class="absolute bottom-4 right-4 z-20 bg-slate-950/92 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-xl text-xs space-y-1.5 pointer-events-auto font-khmer">
          <div class="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 flex items-center gap-1.5">
            <span>🇰🇭 សម្គាល់ផែនទីកម្ពុជា (Legend)</span>
          </div>
          <div class="flex items-center gap-2 text-slate-200 text-[11px]">
            <span class="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
            <span>ទីស្នាក់ការ Admin HQ & រោងចក្រកាត់កញ្ចក់</span>
          </div>
          <div class="flex items-center gap-2 text-slate-200 text-[11px]">
            <span class="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50"></span>
            <span>អ្នកនាំចូល និងផ្គត់ផ្គង់លក់ដុំ (Wholesalers)</span>
          </div>
          <div class="flex items-center gap-2 text-slate-200 text-[11px]">
            <span class="w-3 h-3 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50"></span>
            <span>ហាងលក់រាយវ៉ែនតា និងគ្លីនិកភ្នែក (Retailers)</span>
          </div>
          <div class="pt-1 border-t border-slate-800 text-[10px] text-slate-400 font-sans flex items-center justify-between">
            <span>Cambodia: ភាសាខ្មែរ (Khmer)</span>
            <span class="text-sky-400">Neighbors: English</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import {
  useMapLocationsStore,
  CAMBODIA_PROVINCES,
  getProvinceKhmer,
  type MapLocation,
} from '@/stores/mapLocations.store';
import {
  MapPin,
  Building2,
  Glasses,
  ShieldAlert,
  Search,
  ChevronDown,
  Compass,
} from 'lucide-vue-next';

const store = useMapLocationsStore();

let mapInstance: any = null;
let tileLayerInstance: any = null;
let markersGroup: any = null;
let geoLabelsGroup: any = null;

const activeLocation = ref<MapLocation | null>(null);
const tileTheme = ref<'street' | 'esri' | 'satellite' | 'dark'>('street');

// Cambodia Default Center
const CAMBODIA_CENTER: [number, number] = [12.5657, 104.9910];
const CAMBODIA_ZOOM = 7.6;

// 100% Free Tile Providers (Zero API Key, No Watermark)
const TILE_CONFIGS = {
  street: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    className: '',
  },
  esri: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    className: '',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics',
    className: '',
  },
  dark: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    className: 'dark-tiles-filter',
  },
};

// SVG Marker Icons Factory
const createCustomMarkerIcon = (role: 'ADMIN' | 'WHOLESALER' | 'RETAILER') => {
  const L = (window as any).L;
  if (!L) return null;

  let bgGradient = '';
  let borderColor = '';
  let iconSvg = '';
  let pulseColor = '';

  if (role === 'ADMIN') {
    bgGradient = 'linear-gradient(135deg, #e11d48, #9f1239)';
    borderColor = '#f43f5e';
    pulseColor = 'rgba(225, 29, 72, 0.4)';
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    `;
  } else if (role === 'WHOLESALER') {
    bgGradient = 'linear-gradient(135deg, #9333ea, #6b21a8)';
    borderColor = '#a855f7';
    pulseColor = 'rgba(147, 51, 234, 0.4)';
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
        <path d="M9 22v-4h6v4"/>
        <path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
      </svg>
    `;
  } else {
    // Retailer
    bgGradient = 'linear-gradient(135deg, #0284c7, #0369a1)';
    borderColor = '#38bdf8';
    pulseColor = 'rgba(2, 132, 199, 0.4)';
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-4 0"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/>
      </svg>
    `;
  }

  const html = `
    <div style="position: relative; width: 36px; height: 36px;">
      <div style="
        position: absolute;
        top: -4px;
        left: -4px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: ${pulseColor};
        animation: leafletPulse 2s infinite ease-out;
      "></div>
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: ${bgGradient};
        border: 2px solid ${borderColor};
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        ${iconSvg}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-cambodia-marker',
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

// Popup HTML Card Template (Rich Khmer for Cambodia)
const createPopupContent = (loc: MapLocation) => {
  const roleKhmer =
    loc.role === 'ADMIN'
      ? '👑 ទីស្នាក់ការកណ្តាល (HQ)'
      : loc.role === 'WHOLESALER'
      ? '🏬 អ្នកផ្គត់ផ្គង់លក់ដុំ'
      : '👓 ហាងលក់រាយវ៉ែនតា';

  const roleBadgeClass =
    loc.role === 'ADMIN'
      ? 'background: rgba(225, 29, 72, 0.15); color: #fda4af; border: 1px solid rgba(244, 63, 94, 0.3);'
      : loc.role === 'WHOLESALER'
      ? 'background: rgba(147, 51, 234, 0.15); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.3);'
      : 'background: rgba(2, 132, 199, 0.15); color: #7dd3fc; border: 1px solid rgba(56, 189, 248, 0.3);';

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;

  const displayName = loc.nameKhmer || loc.name;
  const displayAddress = loc.addressKhmer || loc.address;
  const displayProvince = loc.provinceKhmer || getProvinceKhmer(loc.province);
  const displayDistrict = loc.districtKhmer || loc.district;
  const displayCategory = loc.categoryKhmer || loc.category;

  return `
    <div style="
      font-family: 'Kantumruy Pro', 'Inter', sans-serif;
      padding: 14px 16px;
      color: #f1f5f9;
      background: #0f172a;
      border-radius: 18px;
      min-width: 270px;
      max-width: 320px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.7);
      border: 1px solid #334155;
    ">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
        <span style="
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
          ${roleBadgeClass}
        ">
          ${roleKhmer}
        </span>
        <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">
          🇰🇭 ${displayProvince}
        </span>
      </div>

      <h3 style="
        margin: 0 0 4px 0;
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        line-height: 1.4;
      ">
        ${displayName}
      </h3>

      <div style="font-size: 11px; color: #38bdf8; font-weight: 600; margin-bottom: 8px;">
        ${displayCategory}
      </div>

      <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px; line-height: 1.5;">
        📍 <strong>${displayAddress}</strong><br/>
        សង្កាត់/ខណ្ឌ៖ ${displayDistrict}
      </div>

      <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 10px; padding: 6px 10px; background: #1e293b; border-radius: 8px;">
        📞 <strong>${loc.phone}</strong><br/>
        ✉️ <span style="color: #94a3b8; font-family: monospace;">${loc.email}</span>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #334155;">
        <div style="font-size: 10px; color: #64748b; font-family: monospace;">
          Lat: ${loc.lat.toFixed(4)}<br/>Lng: ${loc.lng.toFixed(4)}
        </div>
        <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          background: #0284c7;
          color: #ffffff;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
        ">
          ទិសដៅ Google Maps ↗
        </a>
      </div>
    </div>
  `;
};

// Render Geographic Labels (Khmer inside Cambodia, English for other countries)
const renderGeoLabels = () => {
  const L = (window as any).L;
  if (!L || !mapInstance || !geoLabelsGroup) return;

  geoLabelsGroup.clearLayers();

  // 1. CAMBODIA NATIONAL EMBLEM (KHMER)
  const cambodiaBadgeHtml = `
    <div style="
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(8px);
      border: 1.5px solid rgba(56, 189, 248, 0.6);
      padding: 6px 14px;
      border-radius: 9999px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.5);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      pointer-events: none;
    ">
      <span style="font-size: 16px;">🇰🇭</span>
      <div style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1.1;">
        <span style="font-family: 'Kantumruy Pro', 'Noto Sans Khmer', sans-serif; font-size: 13px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">ព្រះរាជាណាចក្រកម្ពុជា</span>
        <span style="font-size: 9px; font-weight: 700; color: #38bdf8; letter-spacing: 1.2px; text-transform: uppercase;">CAMBODIA</span>
      </div>
    </div>
  `;
  const cambodiaBadgeIcon = L.divIcon({
    className: 'leaflet-cambodia-country-badge',
    html: cambodiaBadgeHtml,
    iconSize: [210, 42],
    iconAnchor: [105, 21],
  });
  L.marker([12.5657, 104.9910], { icon: cambodiaBadgeIcon, interactive: false }).addTo(geoLabelsGroup);

  // 2. TONLE SAP LAKE (KHMER)
  const tonleSapHtml = `
    <div style="
      background: rgba(2, 132, 199, 0.25);
      border: 1px solid rgba(56, 189, 248, 0.4);
      padding: 3px 8px;
      border-radius: 8px;
      font-family: 'Kantumruy Pro', sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: #bae6fd;
      text-shadow: 0 1px 3px rgba(0,0,0,0.8);
      white-space: nowrap;
      pointer-events: none;
    ">
      🌊 បឹងទន្លេសាប (Tonle Sap)
    </div>
  `;
  const tonleSapIcon = L.divIcon({
    className: 'leaflet-tonle-sap-label',
    html: tonleSapHtml,
    iconSize: [140, 24],
    iconAnchor: [70, 12],
  });
  L.marker([12.87, 104.15], { icon: tonleSapIcon, interactive: false }).addTo(geoLabelsGroup);

  // 3. CAMBODIA PROVINCE LABELS IN KHMER
  const PROVINCE_KHMER_LABELS = [
    { text: 'រាជធានីភ្នំពេញ', lat: 11.5564, lng: 104.9282 },
    { text: 'ខេត្តសៀមរាប', lat: 13.3671, lng: 103.8448 },
    { text: 'ខេត្តបាត់ដំបង', lat: 13.0957, lng: 103.2022 },
    { text: 'ខេត្តព្រះសីហនុ', lat: 10.6253, lng: 103.5234 },
    { text: 'ខេត្តកំពង់ចាម', lat: 11.9924, lng: 105.4645 },
    { text: 'ខេត្តកំពត', lat: 10.6104, lng: 104.1818 },
    { text: 'ខេត្តកណ្តាល', lat: 11.4588, lng: 104.9469 },
    { text: 'ខេត្តបន្ទាយមានជ័យ', lat: 13.5859, lng: 102.9737 },
    { text: 'ក្រុងប៉ោយប៉ែត', lat: 13.6561, lng: 102.5634 },
    { text: 'ខេត្តកោះកុង', lat: 11.6153, lng: 102.9838 },
    { text: 'ខេត្តកំពង់ធំ', lat: 12.7111, lng: 104.8887 },
    { text: 'ខេត្តស្ទឹងត្រែង', lat: 13.5259, lng: 105.9683 },
    { text: 'ខេត្តរតនគិរី', lat: 13.7394, lng: 106.9873 },
    { text: 'ខេត្តមណ្ឌលគិរី', lat: 12.4558, lng: 107.1881 },
    { text: 'ខេត្តក្រចេះ', lat: 12.4881, lng: 106.0188 },
    { text: 'ខេត្តព្រះវិហារ', lat: 13.8073, lng: 104.9805 },
    { text: 'ខេត្តពោធិ៍សាត់', lat: 12.5388, lng: 103.9192 },
    { text: 'ខេត្តកំពង់ឆ្នាំង', lat: 12.2500, lng: 104.6667 },
    { text: 'ខេត្តកំពង់ស្ពឺ', lat: 11.4533, lng: 104.5209 },
    { text: 'ខេត្តតាកែវ', lat: 10.9908, lng: 104.7849 },
    { text: 'ខេត្តព្រៃវែង', lat: 11.4868, lng: 105.3253 },
    { text: 'ខេត្តស្វាយរៀង', lat: 11.0879, lng: 105.7993 },
    { text: 'ខេត្តកែប', lat: 10.4828, lng: 104.3167 },
    { text: 'ខេត្តប៉ៃលិន', lat: 12.8489, lng: 102.6093 },
    { text: 'ខេត្តឧត្តរមានជ័យ', lat: 14.1817, lng: 103.5176 },
    { text: 'ខេត្តត្បូងឃ្មុំ', lat: 11.9366, lng: 105.6593 },
  ];

  PROVINCE_KHMER_LABELS.forEach((p) => {
    const html = `
      <div style="
        font-family: 'Kantumruy Pro', 'Noto Sans Khmer', sans-serif;
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(148, 163, 184, 0.3);
        padding: 2px 7px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 700;
        color: #e2e8f0;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${p.text}
      </div>
    `;
    const icon = L.divIcon({
      className: 'leaflet-prov-chip',
      html,
      iconSize: [100, 20],
      iconAnchor: [50, 10],
    });
    L.marker([p.lat, p.lng], { icon, interactive: false }).addTo(geoLabelsGroup);
  });

  // 4. NEIGHBORING / FOREIGN COUNTRIES (ENGLISH ONLY)
  const NEIGHBOR_COUNTRIES = [
    { name: 'THAILAND', desc: 'Kingdom of Thailand', flag: '🇹🇭', lat: 14.8, lng: 101.3 },
    { name: 'VIETNAM', desc: 'Socialist Rep. of Vietnam', flag: '🇻🇳', lat: 11.6, lng: 107.6 },
    { name: 'LAOS', desc: 'Lao PDR', flag: '🇱🇦', lat: 15.2, lng: 106.0 },
    { name: 'GULF OF THAILAND', desc: 'Maritime Waters', flag: '🌊', lat: 9.8, lng: 102.2 },
    { name: 'SOUTH CHINA SEA', desc: 'International Waters', flag: '🌊', lat: 9.8, lng: 107.5 },
  ];

  NEIGHBOR_COUNTRIES.forEach((c) => {
    const html = `
      <div style="
        font-family: 'Inter', sans-serif;
        background: rgba(15, 23, 42, 0.85);
        border: 1px dashed rgba(203, 213, 225, 0.5);
        padding: 4px 10px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      ">
        <span style="font-size: 13px;">${c.flag}</span>
        <span style="font-size: 11px; font-weight: 800; color: #f8fafc; letter-spacing: 1px;">${c.name}</span>
      </div>
    `;
    const icon = L.divIcon({
      className: 'leaflet-foreign-country-label',
      html,
      iconSize: [130, 26],
      iconAnchor: [65, 13],
    });
    L.marker([c.lat, c.lng], { icon, interactive: false }).addTo(geoLabelsGroup);
  });
};

// Initialize Leaflet Map
const initMap = () => {
  const L = (window as any).L;
  if (!L) {
    setTimeout(initMap, 200);
    return;
  }

  const container = document.getElementById('real-cambodia-map-canvas');
  if (!container || mapInstance) return;

  mapInstance = L.map('real-cambodia-map-canvas', {
    center: CAMBODIA_CENTER,
    zoom: CAMBODIA_ZOOM,
    minZoom: 6,
    maxZoom: 18,
    zoomControl: false,
  });

  L.control.zoom({ position: 'topright' }).addTo(mapInstance);

  // Apply Tile Layer
  applyTileLayer();

  // Layer Groups
  geoLabelsGroup = L.layerGroup().addTo(mapInstance);
  markersGroup = L.layerGroup().addTo(mapInstance);

  // Render Labels & Markers
  renderGeoLabels();
  renderMarkers();

  nextTick(() => {
    mapInstance.invalidateSize();
  });
};

// Apply selected Tile Layer
const applyTileLayer = () => {
  const L = (window as any).L;
  if (!L || !mapInstance) return;

  if (tileLayerInstance) {
    mapInstance.removeLayer(tileLayerInstance);
  }

  const config = TILE_CONFIGS[tileTheme.value] || TILE_CONFIGS.street;
  tileLayerInstance = L.tileLayer(config.url, {
    attribution: config.attribution,
    maxZoom: 19,
    className: config.className || undefined,
  }).addTo(mapInstance);
};

// Render Markers onto the Map
const renderMarkers = () => {
  const L = (window as any).L;
  if (!L || !mapInstance || !markersGroup) return;

  markersGroup.clearLayers();

  const locations = store.filteredLocations;

  locations.forEach((loc) => {
    const icon = createCustomMarkerIcon(loc.role);
    if (!icon) return;

    const marker = L.marker([loc.lat, loc.lng], { icon });

    marker.bindPopup(createPopupContent(loc), {
      className: 'brighteyes-custom-popup',
      closeButton: false,
    });

    marker.on('click', () => {
      activeLocation.value = loc;
    });

    markersGroup.addLayer(marker);
  });
};

// Fly to specific location
const flyToLocation = (loc: MapLocation) => {
  if (!mapInstance) return;
  activeLocation.value = loc;
  mapInstance.flyTo([loc.lat, loc.lng], 14, {
    animate: true,
    duration: 1.2,
  });

  if (markersGroup) {
    markersGroup.eachLayer((layer: any) => {
      const latlng = layer.getLatLng();
      if (Math.abs(latlng.lat - loc.lat) < 0.0001 && Math.abs(latlng.lng - loc.lng) < 0.0001) {
        layer.openPopup();
      }
    });
  }
};

// Reset to Cambodia overview
const resetCambodiaView = () => {
  if (!mapInstance) return;
  store.selectedProvince = 'ALL';
  store.searchQuery = '';
  store.selectedRoleFilter = 'ALL';
  mapInstance.flyTo(CAMBODIA_CENTER, CAMBODIA_ZOOM, {
    animate: true,
    duration: 1,
  });
};

const setRoleFilter = (role: 'ALL' | 'ADMIN' | 'WHOLESALER' | 'RETAILER') => {
  store.selectedRoleFilter = role;
};

const handleProvinceChange = () => {
  if (store.selectedProvince === 'ALL') {
    resetCambodiaView();
    return;
  }
  const prov = CAMBODIA_PROVINCES.find((p) => p.name === store.selectedProvince);
  if (prov && mapInstance) {
    mapInstance.flyTo([prov.lat, prov.lng], prov.zoom || 11, {
      animate: true,
      duration: 1.2,
    });
  }
};

watch(
  () => store.filteredLocations,
  () => {
    renderMarkers();
  },
  { deep: true }
);

onMounted(async () => {
  await store.fetchLocations();
  initMap();
});

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
});
</script>

<style>
/* Khmer Font Family */
.font-khmer {
  font-family: 'Kantumruy Pro', 'Noto Sans Khmer', sans-serif;
}

/* Leaflet marker animations & custom popup resets */
@keyframes leafletPulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  70% {
    transform: scale(1.6);
    opacity: 0;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.brighteyes-custom-popup .leaflet-popup-content-wrapper {
  background: transparent !important;
  padding: 0 !important;
  box-shadow: none !important;
  border-radius: 18px !important;
}

.brighteyes-custom-popup .leaflet-popup-content {
  margin: 0 !important;
  line-height: inherit !important;
}

.brighteyes-custom-popup .leaflet-popup-tip {
  background: #0f172a !important;
  border: 1px solid #334155 !important;
}

/* Custom scrollbar for directory */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.6);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(51, 65, 85, 0.8);
  border-radius: 4px;
}

/* Dark Tiles CSS filter */
.dark-tiles-filter {
  filter: brightness(0.65) invert(1) contrast(2.6) hue-rotate(200deg) saturate(0.25) brightness(0.85) !important;
}

/* Hide native browser dropdown arrow so only one custom ChevronDown appears */
select.appearance-none {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  background-image: none !important;
}
select.appearance-none::-ms-expand {
  display: none !important;
}
</style>
