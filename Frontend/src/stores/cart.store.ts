import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { cartService } from '@/services/cart.service';
import type { Cart, CartItem } from '@/types';

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const itemCount = computed(() => cart.value?.items?.length || 0);
  const totalQuantity = computed(() =>
    cart.value?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0
  );
  const subtotal = computed(() => cart.value?.subtotal || 0);
  const items = computed<CartItem[]>(() => cart.value?.items || []);

  async function fetchCart() {
    loading.value = true;
    error.value = null;
    try {
      cart.value = await cartService.getCart();
    } catch (err: any) {
      error.value = err.message || 'Failed to load cart';
    } finally {
      loading.value = false;
    }
  }

  async function addItem(productId: string, quantity: number = 1) {
    loading.value = true;
    error.value = null;
    try {
      cart.value = await cartService.addItem(productId, quantity);
    } catch (err: any) {
      error.value = err.message || 'Failed to add item to cart';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    loading.value = true;
    error.value = null;
    try {
      cart.value = await cartService.updateItemQuantity(itemId, quantity);
    } catch (err: any) {
      error.value = err.message || 'Failed to update item quantity';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function removeItem(itemId: string) {
    loading.value = true;
    error.value = null;
    try {
      cart.value = await cartService.removeItem(itemId);
    } catch (err: any) {
      error.value = err.message || 'Failed to remove item';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function clearCart() {
    loading.value = true;
    try {
      cart.value = await cartService.clearCart();
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    cart,
    loading,
    error,
    itemCount,
    totalQuantity,
    subtotal,
    items,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
});
