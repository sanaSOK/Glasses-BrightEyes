<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100/80 my-6 max-w-2xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-6">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md mb-3">
        <Glasses class="w-6 h-6" />
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        {{ currentRole === 2 ? 'Wholesale Supplier Registration' : 'Retail Optical Store Registration' }}
      </h2>
      <p class="text-xs text-slate-500 mt-1">
        Join Cambodia's leading B2B digital optical network with live nationwide map display
      </p>

      <!-- Role Selector Tabs -->
      <div class="mt-4 flex p-1 bg-slate-100 rounded-2xl max-w-sm mx-auto border border-slate-200">
        <button
          type="button"
          @click="setRole(1)"
          :class="[
            'flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5',
            currentRole === 1
              ? 'bg-white text-sky-700 shadow-md ring-1 ring-slate-200'
              : 'text-slate-500 hover:text-slate-900'
          ]"
        >
          <Glasses class="w-3.5 h-3.5" />
          <span>Retail Store (Role 1)</span>
        </button>
        <button
          type="button"
          @click="setRole(2)"
          :class="[
            'flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5',
            currentRole === 2
              ? 'bg-white text-purple-700 shadow-md ring-1 ring-slate-200'
              : 'text-slate-500 hover:text-slate-900'
          ]"
        >
          <Building2 class="w-3.5 h-3.5" />
          <span>Wholesaler (Role 2)</span>
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Contact Person & Credentials -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Full Contact Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="e.g. Sok Dara"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Business Email Address</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="store@brighteyes.com"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Phone Number (Cambodia)</label>
          <input
            v-model="form.phone"
            type="text"
            required
            placeholder="+855 12 345 678"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="6"
              placeholder="Min 6 characters"
              class="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
              :title="showPassword ? 'Hide password' : 'Show password'"
              tabindex="-1"
            >
              <EyeOff v-if="showPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Retailer Specific Form Fields (Role = 1) -->
      <div v-if="currentRole === 1" class="pt-3 border-t border-slate-100 space-y-3">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
            <Glasses class="w-3.5 h-3.5 text-sky-600" />
            Retail Optical Store Identity
          </span>
          <span class="text-[10px] bg-sky-100 text-sky-700 font-extrabold px-2 py-0.5 rounded">Optical Retail</span>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Store / Clinic Name</label>
          <input
            v-model="form.storeName"
            type="text"
            required
            placeholder="e.g. Phnom Penh Eye Care Center"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>
      </div>

      <!-- Wholesaler Specific Form Fields (Role = 2) -->
      <div v-if="currentRole === 2" class="pt-3 border-t border-slate-100 space-y-3">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 class="w-3.5 h-3.5 text-purple-600" />
            Wholesale Company Identity
          </span>
          <span class="text-[10px] bg-purple-100 text-purple-700 font-extrabold px-2 py-0.5 rounded">Wholesale Supplier</span>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Company / Importer Name</label>
          <input
            v-model="form.companyName"
            type="text"
            required
            placeholder="e.g. Angkor Optics Wholesale Ltd"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
          />
        </div>
      </div>

      <!-- ADDRESS & CAMBODIA MAP LOCATION PICKER SECTION -->
      <div class="pt-4 border-t border-slate-200 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <span class="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin class="w-3.5 h-3.5 text-rose-500" />
              Physical Address & Cambodia Map Pin
            </span>
            <p class="text-[11px] text-slate-500 mt-0.5">
              Input your physical address and pin your location to appear on the Cambodia Optical Map
            </p>
          </div>
          <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            GPS Enabled
          </span>
        </div>

        <!-- Province & District Dropdowns -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Province / Capital City</label>
            <div class="relative">
              <select
                v-model="form.province"
                @change="onProvinceChange"
                required
                class="appearance-none w-full px-3.5 py-2.5 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 cursor-pointer font-khmer"
              >
                <option v-for="prov in CAMBODIA_PROVINCES" :key="prov.name" :value="prov.name">
                  {{ prov.nameKhmer }} ({{ prov.nameEnglish }})
                </option>
              </select>
              <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Khan / District</label>
            <input
              v-model="form.district"
              type="text"
              required
              placeholder="e.g. Khan Sen Sok / Sangkat Teuk Thla"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>
        </div>

        <!-- Detailed Physical Street Address -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">
            {{ currentRole === 2 ? 'Warehouse / Office Street Address' : 'Store Street Address & Building No.' }}
          </label>
          <input
            v-if="currentRole === 1"
            v-model="form.storeAddress"
            type="text"
            required
            placeholder="e.g. #45A, Street 271, Sangkat Teuk Thla"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 focus:bg-white"
          />
          <input
            v-else
            v-model="form.businessAddress"
            type="text"
            required
            placeholder="e.g. #12B, Veng Sreng Blvd, Sangkat Chom Chao"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500 focus:bg-white"
          />
        </div>

        <!-- Interactive Leaflet Mini Map Pin Dropper -->
        <div class="mt-2 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-600 font-medium flex items-center gap-1">
              <span>📍 Drag pin or click map to set exact coordinates</span>
            </span>
            <button
              type="button"
              @click="detectGPS"
              :disabled="gpsLoading"
              class="text-[11px] font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Navigation class="w-3 h-3 text-sky-600" />
              <span>{{ gpsLoading ? 'Locating...' : 'Use My GPS Location' }}</span>
            </button>
          </div>

          <!-- Mini Map Container -->
          <div class="relative rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100 h-56">
            <div id="register-leaflet-map" class="w-full h-full z-0"></div>

            <!-- Coordinate Readout Badge -->
            <div class="absolute bottom-2 left-2 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl text-[10px] font-mono text-slate-200 shadow-lg flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>Lat: {{ form.latitude.toFixed(4) }}°, Lng: {{ form.longitude.toFixed(4) }}°</span>
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs text-slate-600">
            <Info class="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>
              Your pin will be rendered on the <strong>Cambodia Optical Map</strong> with your contact details so wholesalers and retailers can connect seamlessly.
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        :class="[
          'w-full py-3.5 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98] disabled:opacity-50 mt-4 cursor-pointer',
          currentRole === 2
            ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/25'
            : 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/25'
        ]"
      >
        {{ loading ? 'Saving Profile & Registering...' : currentRole === 2 ? 'Complete Wholesaler Registration & Pin to Map' : 'Complete Retail Store Registration & Pin to Map' }}
      </button>
    </form>

    <div class="mt-6 text-center text-xs text-slate-500">
      Already registered?
      <router-link :to="`/login?role=${currentRole}`" class="text-sky-600 font-bold hover:underline">Sign In to Account</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useMapLocationsStore, CAMBODIA_PROVINCES } from '@/stores/mapLocations.store';
import {
  Glasses,
  Building2,
  Eye,
  EyeOff,
  MapPin,
  ChevronDown,
  Navigation,
  Info,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const mapLocationsStore = useMapLocationsStore();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const gpsLoading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);

const currentRole = ref<number>(1);

let miniMap: any = null;
let miniMarker: any = null;

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  storeName: '',
  storeAddress: 'St 271, Sangkat Teuk Thla',
  companyName: '',
  businessAddress: 'Veng Sreng Blvd',
  province: 'Phnom Penh',
  district: 'Khan Sen Sok',
  latitude: 11.5564,
  longitude: 104.9282,
});

onMounted(() => {
  const rParam = route.query.role;
  if (rParam === '2' || rParam === 'wholesaler' || rParam === 'WHOLESALER') {
    currentRole.value = 2;
  } else {
    currentRole.value = 1;
  }

  // Initialize Mini Map
  initMiniMap();
});

onUnmounted(() => {
  if (miniMap) {
    miniMap.remove();
    miniMap = null;
  }
});

const setRole = (roleNum: number) => {
  currentRole.value = roleNum;
  router.replace({ query: { role: roleNum } });
  if (miniMarker) {
    updateMiniMarkerIcon();
  }
};

const createPinIcon = () => {
  const L = (window as any).L;
  if (!L) return null;

  const color = currentRole.value === 2 ? '#9333ea' : '#0284c7';
  const html = `
    <div style="position: relative; width: 34px; height: 34px;">
      <div style="
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        background: ${color};
        transform: rotate(-45deg);
        border: 2px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: #ffffff;
          border-radius: 50%;
        "></div>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-pin-marker',
    html,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });
};

const updateMiniMarkerIcon = () => {
  const icon = createPinIcon();
  if (icon && miniMarker) {
    miniMarker.setIcon(icon);
  }
};

const initMiniMap = () => {
  const L = (window as any).L;
  if (!L) {
    setTimeout(initMiniMap, 200);
    return;
  }

  const container = document.getElementById('register-leaflet-map');
  if (!container || miniMap) return;

  miniMap = L.map('register-leaflet-map', {
    center: [form.latitude, form.longitude],
    zoom: 12,
    zoomControl: false,
  });

  L.control.zoom({ position: 'topright' }).addTo(miniMap);

  // Real OpenStreetMap Tiles (100% Free, No API Key Required)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(miniMap);

  const icon = createPinIcon();
  miniMarker = L.marker([form.latitude, form.longitude], {
    draggable: true,
    icon: icon || undefined,
  }).addTo(miniMap);

  // Map Click updates coordinates and moves marker
  miniMap.on('click', (e: any) => {
    form.latitude = Number(e.latlng.lat.toFixed(5));
    form.longitude = Number(e.latlng.lng.toFixed(5));
    miniMarker.setLatLng(e.latlng);
  });

  // Marker drag end updates coordinates
  miniMarker.on('dragend', (e: any) => {
    const latlng = e.target.getLatLng();
    form.latitude = Number(latlng.lat.toFixed(5));
    form.longitude = Number(latlng.lng.toFixed(5));
  });

  nextTick(() => {
    miniMap.invalidateSize();
  });
};

const onProvinceChange = () => {
  const prov = CAMBODIA_PROVINCES.find((p) => p.name === form.province);
  if (prov) {
    form.latitude = prov.lat;
    form.longitude = prov.lng;
    if (miniMap && miniMarker) {
      miniMarker.setLatLng([prov.lat, prov.lng]);
      miniMap.flyTo([prov.lat, prov.lng], prov.zoom || 12, { animate: true, duration: 1 });
    }
  }
};

const detectGPS = () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  gpsLoading.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      gpsLoading.value = false;
      form.latitude = Number(position.coords.latitude.toFixed(5));
      form.longitude = Number(position.coords.longitude.toFixed(5));
      if (miniMap && miniMarker) {
        miniMarker.setLatLng([form.latitude, form.longitude]);
        miniMap.flyTo([form.latitude, form.longitude], 14, { animate: true, duration: 1 });
      }
    },
    (err) => {
      gpsLoading.value = false;
      console.warn('GPS detection failed:', err);
      alert('Unable to fetch GPS position. You can click on the Cambodia map to position your pin.');
    },
    { timeout: 8000, enableHighAccuracy: true }
  );
};

const handleRegister = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const payload: any = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: currentRole.value,
      province: form.province,
      district: form.district,
      latitude: form.latitude,
      longitude: form.longitude,
    };

    if (currentRole.value === 2) {
      payload.companyName = form.companyName || `${form.name} Optical Wholesale`;
      payload.businessAddress = form.businessAddress || 'Phnom Penh, Cambodia';
    } else {
      payload.storeName = form.storeName || `${form.name} Optical Store`;
      payload.storeAddress = form.storeAddress || 'Phnom Penh, Cambodia';
    }

    const user = await authStore.register(payload);

    // Add newly registered location into mapLocations store so it appears immediately on the Cambodia map
    mapLocationsStore.addRegisteredLocation({
      id: user?.retailer?.id || user?.wholesaler?.id || `user-${Date.now()}`,
      name: currentRole.value === 2 ? payload.companyName : payload.storeName,
      role: currentRole.value === 2 ? 'WHOLESALER' : 'RETAILER',
      address: currentRole.value === 2 ? payload.businessAddress : payload.storeAddress,
      district: form.district,
      province: form.province,
      phone: form.phone,
      email: form.email,
      lat: form.latitude,
      lng: form.longitude,
    });

    if (user.role === 'WHOLESALER') {
      router.push('/wholesaler');
    } else {
      router.push('/retailer');
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Registration failed. Please check your information.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.font-khmer {
  font-family: 'Kantumruy Pro', 'Noto Sans Khmer', sans-serif;
}

/* Remove native browser select arrow so only custom chevron icon appears */
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
