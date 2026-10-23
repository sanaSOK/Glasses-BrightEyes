<template>
  <div class="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col font-sans">
    <!-- 1. Compact Header & Interactive Filter Stats -->
    <div class="p-3.5 sm:p-4 bg-slate-950 border-b border-slate-800/80 space-y-2.5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
            <MapPin class="w-4 h-4" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>Cambodia Optical Map</span>
              <span class="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live
              </span>
            </h2>
            <p class="text-[11px] text-slate-400 font-khmer">
              ទីតាំងជាក់ស្តែងនៃទីស្នាក់ការកណ្តាល (HQ), អ្នកលក់ដុំ (Wholesalers) និងហាងលក់រាយ (Retailers)
            </p>
          </div>
        </div>

        <!-- Quick Register Action -->
        <router-link
          to="/register"
          class="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>+ Register Store</span>
        </router-link>
      </div>

      <!-- 2. Compact Interactive Role Filter Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <!-- ALL -->
        <button
          type="button"
          @click="setRoleFilter('ALL')"
          :class="[
            'p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between',
            store.selectedRoleFilter === 'ALL'
              ? 'bg-slate-800 border-sky-500/80 shadow-xs ring-1 ring-sky-500/30 text-white'
              : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
          ]"
        >
          <div>
            <span class="text-[10px] uppercase font-bold tracking-wider font-khmer block text-slate-400">ទាំងអស់ (All)</span>
            <span class="text-base font-black text-white leading-tight">{{ store.counts.total }}</span>
          </div>
          <Building2 class="w-4 h-4 text-sky-400 opacity-80" />
        </button>

        <!-- ADMIN HQ -->
        <button
          type="button"
          @click="setRoleFilter('ADMIN')"
          :class="[
            'p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between',
            store.selectedRoleFilter === 'ADMIN'
              ? 'bg-rose-950/60 border-rose-500 shadow-xs ring-1 ring-rose-500/30 text-white'
              : 'bg-slate-900/60 border-slate-800/80 hover:bg-rose-950/30 text-slate-400 hover:text-rose-300'
          ]"
        >
          <div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-rose-400 font-khmer block">ទីស្នាក់ការ HQ</span>
            <span class="text-base font-black text-rose-300 leading-tight">{{ store.counts.admin }}</span>
          </div>
          <ShieldAlert class="w-4 h-4 text-rose-400 opacity-80" />
        </button>

        <!-- WHOLESALER -->
        <button
          type="button"
          @click="setRoleFilter('WHOLESALER')"
          :class="[
            'p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between',
            store.selectedRoleFilter === 'WHOLESALER'
              ? 'bg-purple-950/60 border-purple-500 shadow-xs ring-1 ring-purple-500/30 text-white'
              : 'bg-slate-900/60 border-slate-800/80 hover:bg-purple-950/30 text-slate-400 hover:text-purple-300'
          ]"
        >
          <div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-purple-400 font-khmer block">អ្នកលក់ដុំ</span>
            <span class="text-base font-black text-purple-300 leading-tight">{{ store.counts.wholesalers }}</span>
          </div>
          <Boxes class="w-4 h-4 text-purple-400 opacity-80" />
        </button>

        <!-- RETAILER -->
        <button
          type="button"
          @click="setRoleFilter('RETAILER')"
          :class="[
            'p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between',
            store.selectedRoleFilter === 'RETAILER'
              ? 'bg-sky-950/60 border-sky-500 shadow-xs ring-1 ring-sky-500/30 text-white'
              : 'bg-slate-900/60 border-slate-800/80 hover:bg-sky-950/30 text-slate-400 hover:text-sky-300'
          ]"
        >
          <div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-sky-400 font-khmer block">ហាងលក់រាយ</span>
            <span class="text-base font-black text-sky-300 leading-tight">{{ store.counts.retailers }}</span>
          </div>
          <Glasses class="w-4 h-4 text-sky-400 opacity-80" />
        </button>
      </div>

      <!-- 3. Compact Search & Controls Bar -->
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs pt-0.5">
        <!-- Search Input -->
        <div class="relative flex-1 min-w-[180px] max-w-sm">
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="store.searchQuery"
            type="text"
            placeholder="ស្វែងរកឈ្មោះហាង ផ្លូវ ឬខេត្ត..."
            class="w-full pl-8 pr-7 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-khmer"
          />
          <button
            v-if="store.searchQuery"
            @click="store.searchQuery = ''"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X class="w-3 h-3" />
          </button>
        </div>

        <div class="flex items-center flex-wrap gap-1.5">
          <!-- Province Filter -->
          <div class="relative">
            <select
              v-model="store.selectedProvince"
              @change="handleProvinceChange"
              class="appearance-none pl-2.5 pr-7 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer font-khmer"
            >
              <option value="ALL">គ្រប់រាជធានី-ខេត្ត (All)</option>
              <option v-for="prov in CAMBODIA_PROVINCES" :key="prov.name" :value="prov.name">
                {{ prov.nameKhmer }} ({{ prov.nameEnglish }})
              </option>
            </select>
            <ChevronDown class="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <!-- Map Tile Layer -->
          <div class="relative">
            <select
              v-model="tileTheme"
              @change="applyTileLayer"
              class="appearance-none pl-2.5 pr-7 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="street">🗺️ Street</option>
              <option value="esri">🌐 Topo</option>
              <option value="satellite">🛰️ Satellite</option>
              <option value="dark">🌙 Dark</option>
            </select>
            <ChevronDown class="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <!-- Reset Cambodia View -->
          <button
            type="button"
            @click="resetCambodiaView"
            title="Reset View"
            class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Compass class="w-3.5 h-3.5 text-sky-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 4. Compact Map & Directory Split (Smaller height: 490px) -->
    <div class="relative flex-1 flex flex-col lg:flex-row h-[490px]">
      <!-- Left Directory Drawer -->
      <div class="w-full lg:w-72 bg-slate-950/95 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col h-48 lg:h-full z-10">
        <div class="p-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between font-khmer">
          <div class="text-[11px] font-extrabold text-slate-300 flex items-center gap-1.5">
            <Building2 class="w-3.5 h-3.5 text-sky-400" />
            <span>បញ្ជីទីតាំង ({{ store.filteredLocations.length }})</span>
          </div>
          <span class="text-[9px] text-slate-500 font-semibold">ចុចដើម្បីមើល</span>
        </div>

        <div class="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-1.5 space-y-1 custom-scrollbar">
          <div
            v-for="loc in store.filteredLocations"
            :key="loc.id"
            @click="flyToLocation(loc)"
            :class="[
              'p-2 rounded-lg cursor-pointer transition-all border text-left font-khmer group',
              activeLocation?.id === loc.id
                ? 'bg-sky-950/40 border-sky-500 shadow-xs ring-1 ring-sky-500/40'
                : 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/70 hover:border-slate-700'
            ]"
          >
            <div class="flex items-start justify-between gap-1.5">
              <h4 class="text-[11px] font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                {{ loc.nameKhmer || loc.name }}
              </h4>
              <span
                :class="[
                  'text-[8px] font-black uppercase px-1 py-0.2 rounded tracking-wider shrink-0 border',
                  loc.role === 'ADMIN'
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : loc.role === 'WHOLESALER'
                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                    : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                ]"
              >
                {{ loc.role === 'ADMIN' ? 'HQ' : loc.role === 'WHOLESALER' ? 'លក់ដុំ' : 'លក់រាយ' }}
              </span>
            </div>

            <p class="text-[10px] text-slate-400 mt-0.5 line-clamp-1 flex items-center gap-1">
              <MapPin class="w-2.5 h-2.5 text-slate-500 shrink-0" />
              <span>{{ loc.districtKhmer || loc.district }}, {{ loc.provinceKhmer || getProvinceKhmer(loc.province) }}</span>
            </p>

            <div class="flex items-center justify-between text-[9px] text-slate-400 mt-1 font-mono">
              <span class="text-slate-300">{{ loc.phone }}</span>
              <span class="text-sky-400 font-bold group-hover:underline">មើល ↗</span>
            </div>
          </div>

          <div v-if="store.filteredLocations.length === 0" class="p-6 text-center text-[11px] text-slate-500 font-khmer">
            មិនមានទិន្នន័យទីតាំងដែលត្រូវគ្នានឹងការស្វែងរកទេ។
          </div>
        </div>
      </div>

      <!-- Real Leaflet Map Container -->
      <div class="flex-1 relative bg-slate-950 overflow-hidden min-h-[360px]">
        <div id="real-cambodia-map-canvas" class="w-full h-full z-0"></div>

        <!-- Clean Compact Legend -->
        <div class="absolute bottom-3 right-3 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800 py-1.5 px-3 rounded-xl shadow-lg text-[10px] flex items-center gap-2.5 pointer-events-auto font-khmer">
          <div class="flex items-center gap-1 text-slate-300">
            <span class="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>HQ</span>
          </div>
          <div class="flex items-center gap-1 text-slate-300">
            <span class="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Wholesalers</span>
          </div>
          <div class="flex items-center gap-1 text-slate-300">
            <span class="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>Retailers</span>
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
  Plus,
  Boxes,
  X,
} from 'lucide-vue-next';

const store = useMapLocationsStore();

let mapInstance: any = null;
let tileLayerInstance: any = null;
let markersGroup: any = null;

const activeLocation = ref<MapLocation | null>(null);
const tileTheme = ref<'street' | 'esri' | 'satellite' | 'dark'>('street');

// Cambodia Default Center
const CAMBODIA_CENTER: [number, number] = [12.5657, 104.9910];
const CAMBODIA_ZOOM = 7.6;

// Clean Tile Providers
const TILE_CONFIGS = {
  street: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    className: '',
  },
  esri: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    className: '',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    className: '',
  },
  dark: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    className: 'dark-tiles-filter',
  },
};

// SVG Marker Icons Factory (Compact 28px)
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
    pulseColor = 'rgba(225, 29, 72, 0.35)';
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    `;
  } else if (role === 'WHOLESALER') {
    bgGradient = 'linear-gradient(135deg, #9333ea, #6b21a8)';
    borderColor = '#a855f7';
    pulseColor = 'rgba(147, 51, 234, 0.35)';
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
        <path d="M9 22v-4h6v4"/>
        <path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/>
      </svg>
    `;
  } else {
    // Retailer
    bgGradient = 'linear-gradient(135deg, #0284c7, #0369a1)';
    borderColor = '#38bdf8';
    pulseColor = 'rgba(2, 132, 199, 0.35)';
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-4 0"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/>
      </svg>
    `;
  }

  const html = `
    <div style="position: relative; width: 28px; height: 28px;">
      <div style="
        position: absolute;
        top: -3px;
        left: -3px;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: ${pulseColor};
        animation: leafletPulse 2s infinite ease-out;
      "></div>
      <div style="
        position: relative;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: ${bgGradient};
        border: 2px solid ${borderColor};
        box-shadow: 0 3px 8px rgba(0,0,0,0.35);
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
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -15],
  });
};

// Popup HTML Card Template
const createPopupContent = (loc: MapLocation) => {
  const roleKhmer =
    loc.role === 'ADMIN'
      ? '👑 ទីស្នាក់ការ HQ'
      : loc.role === 'WHOLESALER'
      ? '🏬 អ្នកលក់ដុំ'
      : '👓 ហាងលក់រាយ';

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

  return `
    <div style="
      font-family: 'Kantumruy Pro', 'Inter', sans-serif;
      padding: 10px 12px;
      color: #f1f5f9;
      background: #0f172a;
      border-radius: 14px;
      min-width: 230px;
      max-width: 270px;
      box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.7);
      border: 1px solid #334155;
    ">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 4px;">
        <span style="
          font-size: 9px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
          ${roleBadgeClass}
        ">
          ${roleKhmer}
        </span>
        <span style="font-size: 10px; color: #94a3b8; font-weight: 600;">
          🇰🇭 ${displayProvince}
        </span>
      </div>

      <h3 style="
        margin: 0 0 3px 0;
        font-size: 12px;
        font-weight: 700;
        color: #ffffff;
        line-height: 1.3;
      ">
        ${displayName}
      </h3>

      <div style="font-size: 10px; color: #94a3b8; margin-bottom: 5px; line-height: 1.3;">
        📍 ${displayAddress} (${displayDistrict})
      </div>

      <div style="font-size: 10px; color: #cbd5e1; margin-bottom: 6px; padding: 4px 6px; background: #1e293b; border-radius: 6px;">
        📞 <strong>${loc.phone}</strong>
      </div>

      <div style="display: flex; align-items: center; justify-content: flex-end; margin-top: 4px; padding-top: 4px; border-top: 1px solid #334155;">
        <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 4px 8px;
          background: #0284c7;
          color: #ffffff;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          text-decoration: none;
        ">
          Google Maps ↗
        </a>
      </div>
    </div>
  `;
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
  markersGroup = L.layerGroup().addTo(mapInstance);

  // Render Markers
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
  border-radius: 14px !important;
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
  width: 4px;
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
