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
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="••••••••"
            class="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
            :title="showPassword ? 'Hide password' : 'Show password'"
            tabindex="-1"
          >
            <EyeOff v-if="showPassword" class="w-4 h-4" />
            <Eye v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {{ loading ? 'Signing in...' : 'Sign In to Portal' }}
      </button>
    </form>



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
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { Eye, EyeOff } from 'lucide-vue-next';
import brandLogo from '@/assets/logo.png';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');


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
