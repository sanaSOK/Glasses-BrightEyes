import { defineStore } from 'pinia';
import { ref } from 'vue';
import { productService, type ProductQueryParams } from '@/services/product.service';
import type { Product, PaginationMeta, ProductType } from '@/types';

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([]);
  const currentProduct = ref<Product | null>(null);
  const meta = ref<PaginationMeta>({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const loading = ref(false);
  const error = ref<string | null>(null);

  const filters = ref<ProductQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    category: '',
    brand: '',
    productType: undefined,
    wholesalerId: '',
    available: false,
  });

  async function fetchProducts(customParams?: ProductQueryParams) {
    loading.value = true;
    error.value = null;
    const query = { ...filters.value, ...customParams };

    try {
      const res = await productService.getProducts(query);
      products.value = res.data;
      meta.value = res.meta;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch products';
    } finally {
      loading.value = false;
    }
  }

  async function fetchProductById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      currentProduct.value = await productService.getProductById(id);
      return currentProduct.value;
    } catch (err: any) {
      error.value = err.message || 'Product not found';
    } finally {
      loading.value = false;
    }
  }

  function setFilter(key: keyof ProductQueryParams, value: any) {
    (filters.value as any)[key] = value;
    filters.value.page = 1; // Reset to page 1 on filter change
    fetchProducts();
  }

  function resetFilters() {
    filters.value = {
      page: 1,
      limit: 20,
      search: '',
      category: '',
      brand: '',
      productType: undefined,
      wholesalerId: '',
      available: false,
    };
    fetchProducts();
  }

  return {
    products,
    currentProduct,
    meta,
    loading,
    error,
    filters,
    fetchProducts,
    fetchProductById,
    setFilter,
    resetFilters,
  };
});
