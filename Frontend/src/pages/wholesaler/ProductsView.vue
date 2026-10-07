<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Product Catalog Management</h1>
        <p class="text-xs text-slate-500 mt-1">Manage optical products, SKUs, wholesale pricing, and initial stock</p>
      </div>
      <button
        @click="openCreateModal"
        class="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
      >
        <Plus class="w-4 h-4" /> Add Product
      </button>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div v-if="loading" class="py-12 text-center text-slate-400 text-sm">
        Loading products...
      </div>

      <div v-else-if="products.length === 0" class="py-12 text-center text-slate-400 text-sm">
        No products listed yet. Click "+ Add Product" to create your first optical item.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th class="py-3 px-4">Product Name</th>
              <th class="py-3 px-4">SKU</th>
              <th class="py-3 px-4">Type</th>
              <th class="py-3 px-4">Brand</th>
              <th class="py-3 px-4">Retail Price</th>
              <th class="py-3 px-4">Wholesale Price</th>
              <th class="py-3 px-4">Live Stock</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="p in products" :key="p.id" class="hover:bg-slate-50/80">
              <td class="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                <img
                  :src="p.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'"
                  class="w-8 h-8 rounded-lg object-contain bg-slate-50 border p-0.5"
                />
                {{ p.name }}
              </td>
              <td class="py-3 px-4 font-mono font-bold text-purple-700">{{ p.SKU }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold text-slate-600">
                  {{ p.productType }}
                </span>
              </td>
              <td class="py-3 px-4 font-semibold text-sky-600">{{ p.brand }}</td>
              <td class="py-3 px-4 text-slate-400 line-through">${{ p.price.toFixed(2) }}</td>
              <td class="py-3 px-4 font-extrabold text-slate-900">${{ p.wholesalePrice.toFixed(2) }}</td>
              <td class="py-3 px-4">
                <StockBadge
                  :availableQuantity="p.inventory?.availableQuantity"
                  :lowStockThreshold="p.inventory?.lowStockThreshold"
                  :status="p.status"
                />
              </td>
              <td class="py-3 px-4 text-right space-x-2">
                <button @click="editProduct(p)" class="text-slate-400 hover:text-purple-600 font-semibold">Edit</button>
                <button @click="deleteProd(p.id)" class="text-slate-400 hover:text-rose-600 font-semibold">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
        <h3 class="text-lg font-extrabold text-slate-900">
          {{ isEditing ? 'Edit Optical Product' : 'Create New Optical Product' }}
        </h3>

        <form @submit.prevent="saveProduct" class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">SKU</label>
              <input v-model="form.SKU" type="text" required class="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Product Name</label>
              <input v-model="form.name" type="text" required class="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Brand</label>
              <input v-model="form.brand" type="text" required class="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Category</label>
              <select v-model="form.categoryId" required class="w-full px-3 py-2 bg-slate-50 border rounded-xl">
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Product Type</label>
              <select v-model="form.productType" required class="w-full px-3 py-2 bg-slate-50 border rounded-xl">
                <option value="FRAME">Eyeglass Frames</option>
                <option value="SUNGLASSES">Sunglasses</option>
                <option value="CONTACT_LENS">Contact Lenses</option>
                <option value="OPTICAL_LENS">Optical Lenses</option>
                <option value="ACCESSORY">Accessories</option>
                <option value="EQUIPMENT">Equipment</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Image URL</label>
              <input v-model="imageUrlInput" type="text" placeholder="https://..." class="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Retail Price ($)</label>
              <input v-model.number="form.price" type="number" step="0.01" required class="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Wholesale Price ($)</label>
              <input v-model.number="form.wholesalePrice" type="number" step="0.01" required class="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Stock Quantity</label>
              <input v-model.number="form.quantity" type="number" required class="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t">
            <button type="button" @click="showModal = false" class="px-4 py-2 border rounded-xl font-bold">Cancel</button>
            <button type="submit" :disabled="saving" class="px-5 py-2 bg-purple-600 text-white rounded-xl font-bold">
              {{ saving ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import type { Product, ProductCategory, ProductType } from '@/types';
import StockBadge from '@/components/common/StockBadge.vue';
import { Plus } from 'lucide-vue-next';

const authStore = useAuthStore();
const products = ref<Product[]>([]);
const categories = ref<ProductCategory[]>([]);
const loading = ref(true);
const showModal = ref(false);
const isEditing = ref(false);
const saving = ref(false);
const editingId = ref<string | null>(null);
const imageUrlInput = ref('');

const form = reactive({
  SKU: '',
  name: '',
  description: '',
  categoryId: '',
  brand: '',
  productType: 'FRAME' as ProductType,
  price: 100,
  wholesalePrice: 60,
  quantity: 50,
});

const loadData = async () => {
  loading.value = true;
  try {
    const [prodsRes, catsData] = await Promise.all([
      productService.getProducts({ wholesalerId: authStore.wholesalerId || undefined, limit: 100 }),
      categoryService.getCategories(),
    ]);
    products.value = prodsRes.data;
    categories.value = catsData;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.SKU = `SKU-${Date.now().toString().slice(-6)}`;
  form.name = '';
  form.brand = 'Ray-Ban';
  form.categoryId = categories.value[0]?.id || '';
  form.productType = 'FRAME';
  form.price = 120;
  form.wholesalePrice = 75;
  form.quantity = 50;
  imageUrlInput.value = 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80';
  showModal.value = true;
};

const editProduct = (p: Product) => {
  isEditing.value = true;
  editingId.value = p.id;
  form.SKU = p.SKU;
  form.name = p.name;
  form.brand = p.brand;
  form.categoryId = p.categoryId;
  form.productType = p.productType;
  form.price = p.price;
  form.wholesalePrice = p.wholesalePrice;
  form.quantity = p.inventory?.quantity || 0;
  imageUrlInput.value = p.images?.[0]?.imageUrl || '';
  showModal.value = true;
};

const saveProduct = async () => {
  saving.value = true;
  try {
    const payload = {
      ...form,
      images: imageUrlInput.value ? [imageUrlInput.value] : undefined,
    };

    if (isEditing.value && editingId.value) {
      await productService.updateProduct(editingId.value, payload as any);
    } else {
      await productService.createProduct(payload as any);
    }

    showModal.value = false;
    await loadData();
  } catch (err: any) {
    alert(err.message || 'Failed to save product');
  } finally {
    saving.value = false;
  }
};

const deleteProd = async (id: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productService.deleteProduct(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  }
};
</script>
