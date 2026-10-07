<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Product Categories</h1>
        <p class="text-xs text-slate-500 mt-1">Manage optical product classification taxonomy</p>
      </div>
      <button
        @click="openCreateModal"
        class="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
      >
        <Plus class="w-4 h-4" /> Add Category
      </button>
    </div>

    <!-- Category Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="h-28 bg-slate-200/60 rounded-2xl animate-pulse"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between"
      >
        <div>
          <h3 class="font-bold text-slate-900 text-sm">{{ cat.name }}</h3>
          <p class="text-xs text-slate-500 mt-0.5">{{ cat.description }}</p>
          <span class="text-[11px] font-bold text-sky-600 mt-2 block">
            {{ cat._count?.products || 0 }} Associated Products
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button @click="editCat(cat)" class="text-slate-400 hover:text-sky-600 text-xs font-semibold">Edit</button>
          <button @click="deleteCat(cat.id)" class="text-slate-400 hover:text-rose-600 text-xs font-semibold">Delete</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
        <h3 class="text-base font-extrabold text-slate-900">{{ isEditing ? 'Edit Category' : 'Create Category' }}</h3>
        <form @submit.prevent="saveCat" class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Category Name</label>
            <input v-model="form.name" type="text" required class="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 bg-slate-50 border rounded-xl"></textarea>
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t">
            <button type="button" @click="showModal = false" class="px-4 py-2 border rounded-xl font-bold">Cancel</button>
            <button type="submit" :disabled="saving" class="px-5 py-2 bg-sky-600 text-white rounded-xl font-bold">
              {{ saving ? 'Saving...' : 'Save Category' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { categoryService } from '@/services/category.service';
import type { ProductCategory } from '@/types';
import { Plus } from 'lucide-vue-next';

const categories = ref<ProductCategory[]>([]);
const loading = ref(true);
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);

const form = reactive({
  name: '',
  description: '',
});

const loadCategories = async () => {
  loading.value = true;
  try {
    categories.value = await categoryService.getCategories();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadCategories);

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.name = '';
  form.description = '';
  showModal.value = true;
};

const editCat = (c: ProductCategory) => {
  isEditing.value = true;
  editingId.value = c.id;
  form.name = c.name;
  form.description = c.description || '';
  showModal.value = true;
};

const saveCat = async () => {
  saving.value = true;
  try {
    if (isEditing.value && editingId.value) {
      await categoryService.updateCategory(editingId.value, form);
    } else {
      await categoryService.createCategory(form);
    }
    showModal.value = false;
    await loadCategories();
  } catch (err: any) {
    alert(err.message || 'Failed to save category');
  } finally {
    saving.value = false;
  }
};

const deleteCat = async (id: string) => {
  if (confirm('Delete this category?')) {
    try {
      await categoryService.deleteCategory(id);
      await loadCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  }
};
</script>
