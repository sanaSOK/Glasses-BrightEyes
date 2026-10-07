<template>
  <div class="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100/80 my-6 max-w-lg mx-auto">
    <!-- Header -->
    <div class="text-center mb-6">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md mb-3">
        <Glasses class="w-6 h-6" />
      </div>
      <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">
        {{ currentRole === 2 ? 'Wholesaler Supplier Registration' : 'Retail Optical Store Registration' }}
      </h2>
      <p class="text-xs text-slate-500 mt-1">
        {{ currentRole === 2 ? 'Role = 2 (Wholesaler Supplier Account)' : 'Role = 1 (Retail Optical Store Account)' }}
      </p>
    </div>

    <!-- Direct Role Switcher Bar -->
    <div class="flex items-center bg-slate-100 p-1 rounded-2xl mb-6 text-xs font-bold">
      <button
        type="button"
        @click="setRole(1)"
        :class="[
          'flex-1 py-2.5 rounded-xl transition-all text-center flex items-center justify-center gap-1.5',
          currentRole === 1
            ? 'bg-sky-600 text-white shadow-md'
            : 'text-slate-600 hover:text-slate-900'
        ]"
      >
        <span>👓 Retailer Store</span>
        <span class="text-[10px] opacity-80">(Role 1)</span>
      </button>
      <button
        type="button"
        @click="setRole(2)"
        :class="[
          'flex-1 py-2.5 rounded-xl transition-all text-center flex items-center justify-center gap-1.5',
          currentRole === 2
            ? 'bg-purple-600 text-white shadow-md'
            : 'text-slate-600 hover:text-slate-900'
        ]"
      >
        <span>🏬 Wholesaler Supplier</span>
        <span class="text-[10px] opacity-80">(Role 2)</span>
      </button>
    </div>

    <div v-if="errorMessage" class="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Basic Info -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Full Contact Name</label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="Contact Person Full Name"
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
        <input
          v-model="form.email"
          type="email"
          required
          placeholder="business@brighteyes.com"
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
          <input
            v-model="form.phone"
            type="text"
            required
            placeholder="+855 12 345 678"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="6"
            placeholder="Min 6 characters"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <!-- Retailer Specific Form Fields (Role = 1) -->
      <div v-if="currentRole === 1" class="pt-3 border-t border-slate-100 space-y-3">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-sky-700 uppercase tracking-wider">Retail Optical Store Details</span>
          <span class="text-[11px] bg-sky-100 text-sky-700 font-bold px-2 py-0.5 rounded">Role 1</span>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Store Name</label>
          <input
            v-model="form.storeName"
            type="text"
            required
            placeholder="e.g. Phnom Penh Eye Care Center"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Store Physical Address</label>
          <input
            v-model="form.storeAddress"
            type="text"
            required
            placeholder="Street address & store location"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      <!-- Wholesaler Specific Form Fields (Role = 2) -->
      <div v-if="currentRole === 2" class="pt-3 border-t border-slate-100 space-y-3">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-purple-700 uppercase tracking-wider">Wholesale Supplier Details</span>
          <span class="text-[11px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded">Role 2</span>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Company Name</label>
          <input
            v-model="form.companyName"
            type="text"
            required
            placeholder="e.g. Angkor Optics Wholesale Ltd"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Head Office Business Address</label>
          <input
            v-model="form.businessAddress"
            type="text"
            required
            placeholder="Office / Warehouse Address"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      <!-- Location Details -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Province</label>
          <input
            v-model="form.province"
            type="text"
            required
            placeholder="e.g. Phnom Penh"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">District</label>
          <input
            v-model="form.district"
            type="text"
            required
            placeholder="e.g. Sen Sok"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        :class="[
          'w-full py-3 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98] disabled:opacity-50 mt-4',
          currentRole === 2 ? 'bg-purple-600 hover:bg-purple-700' : 'bg-sky-600 hover:bg-sky-700'
        ]"
      >
        {{ loading ? 'Creating Account...' : currentRole === 2 ? 'Complete Wholesaler Registration (Role 2)' : 'Complete Retailer Registration (Role 1)' }}
      </button>
    </form>

    <div class="mt-6 text-center text-xs text-slate-500">
      Already registered?
      <router-link :to="`/login?role=${currentRole}`" class="text-sky-600 font-bold hover:underline">Sign In to Account</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { Glasses } from 'lucide-vue-next';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const errorMessage = ref('');

// Parse role parameter from query string (?role=1 or ?role=2 or ?role=wholesaler)
const currentRole = ref<number>(1);

onMounted(() => {
  const rParam = route.query.role;
  if (rParam === '2' || rParam === 'wholesaler' || rParam === 'WHOLESALER') {
    currentRole.value = 2;
  } else {
    currentRole.value = 1;
  }
});

const setRole = (roleNum: number) => {
  currentRole.value = roleNum;
  router.replace({ query: { role: roleNum } });
};

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  storeName: '',
  storeAddress: '',
  companyName: '',
  businessAddress: '',
  province: 'Phnom Penh',
  district: 'Sen Sok',
});

const handleRegister = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const payload: any = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: currentRole.value, // Passed as 1 for Retailer, 2 for Wholesaler
      province: form.province,
      district: form.district,
    };

    if (currentRole.value === 2) {
      payload.companyName = form.companyName || `${form.name} Optical Wholesale`;
      payload.businessAddress = form.businessAddress || 'Phnom Penh, Cambodia';
    } else {
      payload.storeName = form.storeName || `${form.name} Optical Store`;
      payload.storeAddress = form.storeAddress || 'Phnom Penh, Cambodia';
    }

    const user = await authStore.register(payload);
    if (user.role === 'WHOLESALER') router.push('/wholesaler');
    else router.push('/retailer');
  } catch (err: any) {
    errorMessage.value = err.message || 'Registration failed';
  } finally {
    loading.value = false;
  }
};
</script>
