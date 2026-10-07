<template>
  <div class="space-y-6 max-w-3xl mx-auto">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Retailer Store Profile</h1>
      <p class="text-xs text-slate-500 mt-1">Manage your retail optical store information and business contact</p>
    </div>

    <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
      <div v-if="savedMessage" class="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-xl">
        {{ savedMessage }}
      </div>

      <form @submit.prevent="saveProfile" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Store Name</label>
          <input
            v-model="form.storeName"
            type="text"
            required
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Store Address</label>
          <input
            v-model="form.storeAddress"
            type="text"
            required
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Province</label>
            <input
              v-model="form.province"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">District</label>
            <input
              v-model="form.district"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
          <input
            v-model="form.phone"
            type="text"
            required
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
          >
            {{ saving ? 'Saving Changes...' : 'Save Profile Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { retailersService } from '@/services/retailers.service';

const authStore = useAuthStore();
const saving = ref(false);
const savedMessage = ref('');

const form = reactive({
  storeName: '',
  storeAddress: '',
  province: '',
  district: '',
  phone: '',
});

onMounted(() => {
  const ret = authStore.user?.retailer;
  if (ret) {
    form.storeName = ret.storeName;
    form.storeAddress = ret.storeAddress;
    form.province = ret.province;
    form.district = ret.district;
    form.phone = ret.phone;
  }
});

const saveProfile = async () => {
  saving.value = true;
  savedMessage.value = '';
  try {
    await retailersService.updateProfile(form);
    await authStore.fetchCurrentUser();
    savedMessage.value = 'Profile updated successfully!';
  } catch (err: any) {
    alert(err.message || 'Failed to update profile');
  } finally {
    saving.value = false;
  }
};
</script>
