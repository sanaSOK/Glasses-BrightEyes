<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Users Management</h1>
      <p class="text-xs text-slate-500 mt-1">Super Admin control over registered platform accounts</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div v-if="loading" class="py-12 text-center text-slate-400 text-sm">
        Loading users...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">User Name</th>
              <th class="py-3 px-4">Email Address</th>
              <th class="py-3 px-4">Role</th>
              <th class="py-3 px-4">Associated Business</th>
              <th class="py-3 px-4 text-center">Account Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/80">
              <td class="py-3 px-4 font-bold text-slate-900">{{ user.name }}</td>
              <td class="py-3 px-4 font-mono text-slate-600">{{ user.email }}</td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider',
                    user.role === 'SUPER_ADMIN' ? 'bg-slate-900 text-white' : user.role === 'WHOLESALER' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'
                  ]"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="py-3 px-4 font-medium text-slate-600">
                {{ user.wholesaler?.companyName || user.retailer?.storeName || '-' }}
              </td>
              <td class="py-3 px-4 text-center">
                <span :class="['px-2.5 py-0.5 rounded-full text-[11px] font-bold', user.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200']">
                  {{ user.active ? 'ACTIVE' : 'DEACTIVATED' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  v-if="user.role !== 'SUPER_ADMIN'"
                  @click="toggleActive(user)"
                  :class="['px-3 py-1.5 rounded-xl font-bold transition-colors', user.active ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100']"
                >
                  {{ user.active ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminService } from '@/services/admin.service';
import type { User } from '@/types';

const users = ref<User[]>([]);
const loading = ref(true);

const loadUsers = async () => {
  loading.value = true;
  try {
    users.value = await adminService.getUsers();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadUsers);

const toggleActive = async (u: User) => {
  try {
    await adminService.toggleUserActive(u.id, !u.active);
    await loadUsers();
  } catch (err: any) {
    alert(err.message || 'Failed to update status');
  }
};
</script>
