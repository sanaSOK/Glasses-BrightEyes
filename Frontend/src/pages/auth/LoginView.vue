<template>
  <div class="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100/80 my-6 max-w-md mx-auto">
    <div class="text-center mb-6">
      <img :src="brandLogo" alt="BrightEyes Logo" class="w-14 h-14 rounded-full object-contain mx-auto shadow-lg shadow-sky-500/30 mb-3 bg-white p-0.5" />
      <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Bright<span class="text-sky-600">Eyes</span> Portal Login</h2>
      <p class="text-xs text-slate-500 mt-1">Enter your email and password to sign in</p>
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
        class="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {{ loading ? 'Signing in...' : 'Sign In to Portal' }}
      </button>
    </form>

    <!-- Role Pre-Filled Quick Demo Logins -->
    <div class="mt-6 pt-5 border-t border-slate-100">
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">Pre-Configured Demo Accounts</p>
      
      <div class="space-y-2">
        <button
          @click="fillCredentials('admin@brighteyes.com', 'password123')"
          class="w-full text-left px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-between border border-slate-300/60"
        >
          <span>👑 Super Admin: System Admin</span>
          <span class="text-[10px] bg-slate-300 px-1.5 py-0.5 rounded font-bold">Admin</span>
        </button>
        <button
          @click="fillCredentials('wholesaler1@brighteyes.com', 'password123')"
          class="w-full text-left px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold flex items-center justify-between border border-purple-200/60"
        >
          <span>🏬 Wholesaler: Sokha Optical Supply</span>
          <span class="text-[10px] bg-purple-200 px-1.5 py-0.5 rounded font-bold">Wholesaler</span>
        </button>
        <button
          @click="fillCredentials('retailer1@brighteyes.com', 'password123')"
          class="w-full text-left px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center justify-between border border-sky-200/60"
        >
          <span>👓 Retailer: Phnom Penh Eyewear</span>
          <span class="text-[10px] bg-sky-200 px-1.5 py-0.5 rounded font-bold">Retailer</span>
        </button>
      </div>
    </div>

    <!-- Register Link -->
    <div class="mt-6 text-center text-xs text-slate-500">
      Need a new account?
      <router-link to="/register" class="text-sky-600 font-bold hover:underline">
        Register Account
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
    password.value = 'password123';
  } else if (rParam === '3' || rParam === 'admin' || rParam === 'SUPER_ADMIN') {
    activeRole.value = 3;
    email.value = 'admin@brighteyes.com';
    password.value = 'password123';
  } else if (rParam === '1' || rParam === 'retailer' || rParam === 'RETAILER') {
    activeRole.value = 1;
    email.value = 'retailer1@brighteyes.com';
    password.value = 'password123';
  }
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

    // Validate if the intended redirect matches the authenticated user's role
    const redirectUrl = route.query.redirect as string;
    const isRedirectValid = redirectUrl && (
      (user.role === 'SUPER_ADMIN' && redirectUrl.startsWith('/admin')) ||
      (user.role === 'WHOLESALER' && redirectUrl.startsWith('/wholesaler')) ||
      (user.role === 'RETAILER' && redirectUrl.startsWith('/retailer'))
    );

    if (isRedirectValid) {
      router.push(redirectUrl);
    } else if (user.role === 'SUPER_ADMIN') {
      router.push('/admin');
    } else if (user.role === 'WHOLESALER') {
      router.push('/wholesaler');
    } else {
      router.push('/retailer');
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Invalid email or password';
  } finally {
    loading.value = false;
  }
};
</script>
