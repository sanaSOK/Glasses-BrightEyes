import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService, type LoginPayload, type RegisterPayload } from '@/services/auth.service';
import type { User, Role } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('brighteyes_user') || 'null'));
  const accessToken = ref<string | null>(localStorage.getItem('brighteyes_access_token'));
  const refreshToken = ref<string | null>(localStorage.getItem('brighteyes_refresh_token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const role = computed<Role | null>(() => user.value?.role || null);
  const isSuperAdmin = computed(() => role.value === 'SUPER_ADMIN');
  const isWholesaler = computed(() => role.value === 'WHOLESALER');
  const isRetailer = computed(() => role.value === 'RETAILER');

  const wholesalerId = computed(() => user.value?.wholesaler?.id || null);
  const retailerId = computed(() => user.value?.retailer?.id || null);

  async function login(payload: LoginPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await authService.login(payload);
      user.value = res.user;
      accessToken.value = res.accessToken;
      refreshToken.value = res.refreshToken;

      localStorage.setItem('brighteyes_access_token', res.accessToken);
      localStorage.setItem('brighteyes_refresh_token', res.refreshToken);
      localStorage.setItem('brighteyes_user', JSON.stringify(res.user));

      return res.user;
    } catch (err: any) {
      error.value = err.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await authService.register(payload);
      user.value = res.user;
      accessToken.value = res.accessToken;
      refreshToken.value = res.refreshToken;

      localStorage.setItem('brighteyes_access_token', res.accessToken);
      localStorage.setItem('brighteyes_refresh_token', res.refreshToken);
      localStorage.setItem('brighteyes_user', JSON.stringify(res.user));

      return res.user;
    } catch (err: any) {
      error.value = err.message || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCurrentUser() {
    if (!accessToken.value) return;
    try {
      const userData = await authService.getMe();
      user.value = userData;
      localStorage.setItem('brighteyes_user', JSON.stringify(userData));
    } catch (err) {
      logout();
    }
  }

  function logout() {
    authService.logout();
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('brighteyes_access_token');
    localStorage.removeItem('brighteyes_refresh_token');
    localStorage.removeItem('brighteyes_user');
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    isAuthenticated,
    role,
    isSuperAdmin,
    isWholesaler,
    isRetailer,
    wholesalerId,
    retailerId,
    login,
    register,
    fetchCurrentUser,
    logout,
  };
});
