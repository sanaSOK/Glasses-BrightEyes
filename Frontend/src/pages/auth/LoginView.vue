<template>
  <div class="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100/80 my-6 max-w-md mx-auto">
    <div class="text-center mb-6">
      <img :src="brandLogo" alt="BrightEyes Logo" class="w-14 h-14 rounded-full object-contain mx-auto shadow-lg shadow-sky-500/30 mb-3 bg-white p-0.5" />
      <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Bright<span class="text-sky-600">Eyes</span> Portal Login</h2>
      <p class="text-xs text-slate-500 mt-1">Select your account portal role to sign in</p>
    </div>

    <!-- Role Selection Tabs -->
    <div class="flex items-center bg-slate-100 p-1 rounded-2xl mb-6 text-xs font-bold">
      <button
        type="button"
        @click="activeRole = 1"
        :class="[
          'flex-1 py-2 rounded-xl transition-all text-center flex items-center justify-center gap-1',
          activeRole === 1
            ? 'bg-sky-600 text-white shadow-md'
            : 'text-slate-600 hover:text-slate-900'
        ]"
      >
        <span>Retailer</span>
        <span class="text-[10px] opacity-80">(Role 1)</span>
      </button>
      <button
        type="button"
        @click="activeRole = 2"
        :class="[
          'flex-1 py-2 rounded-xl transition-all text-center flex items-center justify-center gap-1',
          activeRole === 2
            ? 'bg-purple-600 text-white shadow-md'
            : 'text-slate-600 hover:text-slate-900'
        ]"
      >
        <span>Wholesaler</span>
        <span class="text-[10px] opacity-80">(Role 2)</span>
      </button>
      <button
        type="button"
        @click="activeRole = 3"
        :class="[
          'flex-1 py-2 rounded-xl transition-all text-center flex items-center justify-center gap-1',
          activeRole === 3
            ? 'bg-slate-900 text-white shadow-md'
            : 'text-slate-600 hover:text-slate-900'
        ]"
      >
        <span>Admin</span>
        <span class="text-[10px] opacity-80">(Role 3)</span>
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMessage" class="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
      {{ errorMessage }}
    </div>

    <!-- Form -->
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
        <input
          v-model="email"
          type="email"
          required
          placeholder="your.email@brighteyes.com"
          class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
          class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        :class="[
          'w-full py-3 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50',
          activeRole === 2 ? 'bg-purple-600 hover:bg-purple-700' : activeRole === 3 ? 'bg-slate-900 hover:bg-slate-800' : 'bg-sky-600 hover:bg-sky-700'
        ]"
      >
        {{ loading ? 'Signing in...' : activeRole === 2 ? 'Sign In as Wholesaler (Role 2)' : activeRole === 3 ? 'Sign In as Super Admin' : 'Sign In as Retailer (Role 1)' }}
      </button>
    </form>

    <!-- Role Pre-Filled Quick Demo Logins -->
    <div class="mt-6 pt-5 border-t border-slate-100">
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">Pre-Configured Role Demo Accounts</p>
      
      <div v-if="activeRole === 1" class="space-y-2">
        <button
          @click="fillCredentials('retailer1@brighteyes.com', 'password123')"
          class="w-full text-left px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center justify-between border border-sky-200/60"
        >
          <span>👓 Retailer 1: Phnom Penh Eyewear</span>
          <span class="text-[10px] bg-sky-200 px-1.5 py-0.5 rounded font-bold">Role 1</span>
        </button>
        <button
          @click="fillCredentials('retailer2@brighteyes.com', 'password123')"
          class="w-full text-left px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center justify-between border border-sky-200/60"
        >
          <span>👓 Retailer 2: Siem Reap Vision Care</span>
          <span class="text-[10px] bg-sky-200 px-1.5 py-0.5 rounded font-bold">Role 1</span>
        </button>
      </div>

      <div v-else-if="activeRole === 2" class="space-y-2">
        <button
          @click="fillCredentials('wholesaler1@brighteyes.com', 'password123')"
          class="w-full text-left px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold flex items-center justify-between border border-purple-200/60"
        >
          <span>🏬 Wholesaler 1: Sokha Optical Supply</span>
          <span class="text-[10px] bg-purple-200 px-1.5 py-0.5 rounded font-bold">Role 2</span>
        </button>
        <button
          @click="fillCredentials('wholesaler2@brighteyes.com', 'password123')"
          class="w-full text-left px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold flex items-center justify-between border border-purple-200/60"
        >
          <span>🏬 Wholesaler 2: Angkor Vision Wholesale</span>
          <span class="text-[10px] bg-purple-200 px-1.5 py-0.5 rounded font-bold">Role 2</span>
        </button>
      </div>

      <div v-else class="space-y-2">
        <button
          @click="fillCredentials('admin@brighteyes.com', 'password123')"
          class="w-full text-left px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-between border border-slate-300/60"
        >
          <span>👑 Super Admin: System Admin</span>
          <span class="text-[10px] bg-slate-300 px-1.5 py-0.5 rounded font-bold">Role 3</span>
        </button>
      </div>
    </div>

    <!-- Register Link -->
    <div class="mt-6 text-center text-xs text-slate-500">
      Need a new account?
      <router-link :to="`/register?role=${activeRole}`" class="text-sky-600 font-bold hover:underline">
        Register {{ activeRole === 2 ? 'Wholesaler (Role 2)' : 'Retailer (Role 1)' }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { Glasses } from 'lucide-vue-next';
import brandLogo from '@/assets/logo.png';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const activeRole = ref<number>(1);

onMounted(() => {
  const rParam = route.query.role;
  if (rParam === '2' || rParam === 'wholesaler' || rParam === 'WHOLESALER') {
    activeRole.value = 2;
    email.value = 'wholesaler1@brighteyes.com';
  } else if (rParam === '3' || rParam === 'admin' || rParam === 'SUPER_ADMIN') {
    activeRole.value = 3;
    email.value = 'admin@brighteyes.com';
  } else {
    activeRole.value = 1;
    email.value = 'retailer1@brighteyes.com';
  }
  password.value = 'password123';
});

const fillCredentials = (e: string, p: string) => {
  email.value = e;
  password.value = p;
};

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const user = await authStore.login({ email: email.value, password: password.value });
    if (user.role === 'SUPER_ADMIN') router.push('/admin');
    else if (user.role === 'WHOLESALER') router.push('/wholesaler');
    else router.push('/retailer');
  } catch (err: any) {
    errorMessage.value = err.message || 'Invalid email or password';
  } finally {
    loading.value = false;
  }
};
</script>
