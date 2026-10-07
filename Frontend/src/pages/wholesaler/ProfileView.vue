<template>
  <div class="space-y-6 max-w-3xl mx-auto">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Wholesaler Company Profile</h1>
      <p class="text-xs text-slate-500 mt-1">Manage wholesale company profile, business address, and logo URL</p>
    </div>

    <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
      <div v-if="savedMessage" class="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-xl">
        {{ savedMessage }}
      </div>

      <form @submit.prevent="saveProfile" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Company Name</label>
          <input
            v-model="form.companyName"
            type="text"
            required
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Business Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          ></textarea>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Business Address</label>
          <input
            v-model="form.businessAddress"
            type="text"
            required
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Province</label>
            <input
              v-model="form.province"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">District</label>
            <input
              v-model="form.district"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Business Phone</label>
          <input
            v-model="form.phone"
            type="text"
            required
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Company Logo URL</label>
          <input
            v-model="form.logoUrl"
            type="text"
            placeholder="https://..."
            class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
          >
            {{ saving ? 'Saving Changes...' : 'Save Company Profile' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { wholesalerService } from '@/services/wholesaler.service';

const authStore = useAuthStore();
const saving = ref(false);
const savedMessage = ref('');

const form = reactive({
  companyName: '',
  description: '',
  businessAddress: '',
  province: '',
  district: '',
  phone: '',
  logoUrl: '',
});

onMounted(() => {
  const w = authStore.user?.wholesaler;
  if (w) {
    form.companyName = w.companyName;
    form.description = w.description || '';
    form.businessAddress = w.businessAddress;
    form.province = w.province;
    form.district = w.district;
    form.phone = w.phone;
    form.logoUrl = w.logoUrl || '';
  }
});

const saveProfile = async () => {
  saving.value = true;
  savedMessage.value = '';
  try {
    await wholesalerService.updateProfile(form);
    await authStore.fetchCurrentUser();
    savedMessage.value = 'Company profile updated successfully!';
  } catch (err: any) {
    alert(err.message || 'Failed to update company profile');
  } finally {
    saving.value = false;
  }
};
</script>
