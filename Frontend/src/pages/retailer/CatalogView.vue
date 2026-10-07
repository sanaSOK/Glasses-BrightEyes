<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Optical Product Catalog</h1>
        <p class="text-xs text-slate-500 mt-1">Browse active inventory from verified Cambodian optical wholesalers</p>
      </div>
    </div>

    <!-- Filter Component -->
    <ProductFilter :categories="categories" @filter-change="handleFilterChange" />

    <!-- Loading State -->
    <div v-if="productStore.loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="h-80 bg-slate-200/60 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Product Grid -->
    <div v-else-if="productStore.products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in productStore.products"
        :key="product.id"
        :product="product"
        :isRetailer="true"
        :adding="addingProductId === product.id"
        @add-to-cart="onAddToCart"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
      <PackageSearch class="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-base font-bold text-slate-800">No Optical Products Found</h3>
      <p class="text-xs text-slate-500 mt-1 mb-4">Try clearing filters or adjusting your search term.</p>
      <button @click="productStore.resetFilters()" class="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold">
        Reset All Filters
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="productStore.meta.totalPages > 1" class="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80">
      <span class="text-xs text-slate-500">
        Showing Page <strong class="text-slate-800">{{ productStore.meta.page }}</strong> of <strong class="text-slate-800">{{ productStore.meta.totalPages }}</strong> ({{ productStore.meta.total }} Total Items)
      </span>
      <div class="flex items-center gap-2">
        <button
          @click="changePage(productStore.meta.page - 1)"
          :disabled="productStore.meta.page <= 1"
          class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          @click="changePage(productStore.meta.page + 1)"
          :disabled="productStore.meta.page >= productStore.meta.totalPages"
          class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/product.store';
import { useCartStore } from '@/stores/cart.store';
import { categoryService } from '@/services/category.service';
import type { ProductCategory, Product } from '@/types';
import ProductCard from '@/components/products/ProductCard.vue';
import ProductFilter from '@/components/products/ProductFilter.vue';
import { PackageSearch } from 'lucide-vue-next';

const productStore = useProductStore();
const cartStore = useCartStore();

const categories = ref<ProductCategory[]>([]);
const addingProductId = ref<string | null>(null);

onMounted(async () => {
  productStore.fetchProducts();
  try {
    categories.value = await categoryService.getCategories();
  } catch (err) {
    console.error(err);
  }
});

const handleFilterChange = (filterData: any) => {
  productStore.setFilter('search', filterData.search);
  productStore.setFilter('category', filterData.category);
  productStore.setFilter('productType', filterData.productType);
  productStore.setFilter('brand', filterData.brand);
  productStore.setFilter('available', filterData.available);
};

const changePage = (newPage: number) => {
  productStore.setFilter('page', newPage);
};

const onAddToCart = async (product: Product) => {
  addingProductId.value = product.id;
  try {
    await cartStore.addItem(product.id, 1);
  } catch (err: any) {
    alert(err.message || 'Failed to add item to cart');
  } finally {
    addingProductId.value = null;
  }
};
</script>
