<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <div>
      <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Shopping Cart & B2B Checkout</h1>
      <p class="text-xs text-slate-500 mt-1">Review selected optical items, confirm stock availability, and place orders</p>
    </div>

    <div v-if="cartStore.loading && !cartStore.cart" class="py-12 text-center text-slate-400 text-sm">
      Loading shopping cart...
    </div>

    <div v-else-if="cartStore.itemCount === 0" class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
      <ShoppingCart class="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 class="text-base font-bold text-slate-800">Your Cart is Empty</h3>
      <p class="text-xs text-slate-500 mt-1 mb-4">Add eyeglass frames, sunglasses, or lenses to your order.</p>
      <router-link to="/retailer/products" class="px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-md">
        Browse Optical Catalog
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Cart Items Table -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <span class="text-sm font-bold text-slate-900">Cart Items ({{ cartStore.itemCount }})</span>
            <button @click="cartStore.clearCart()" class="text-xs font-semibold text-rose-600 hover:underline">
              Clear All Items
            </button>
          </div>

          <div class="space-y-4 divide-y divide-slate-100">
            <div v-for="item in cartStore.items" :key="item.id" class="pt-4 first:pt-0 flex items-center justify-between gap-4">
              <!-- Item Details -->
              <div class="flex items-center gap-3 min-w-0">
                <img
                  :src="getItemImage(item)"
                  :alt="item.product?.name"
                  class="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-100 p-1 shrink-0"
                />
                <div class="min-w-0">
                  <h4 class="font-bold text-slate-900 text-sm truncate">{{ item.product?.name }}</h4>
                  <p class="text-xs text-slate-400 font-mono">SKU: {{ item.product?.SKU }}</p>
                  <p class="text-xs text-sky-600 font-bold mt-0.5">${{ item.price.toFixed(2) }} / unit</p>
                  
                  <!-- Stock Availability Indicator -->
                  <p v-if="item.availableStock !== undefined" class="text-[11px] mt-1 font-semibold" :class="item.isStockSufficient ? 'text-emerald-600' : 'text-rose-600'">
                    {{ item.isStockSufficient ? `In Stock (${item.availableStock} available)` : `Insufficient Stock (${item.availableStock} available)` }}
                  </p>
                </div>
              </div>

              <!-- Quantity Controls & Subtotal -->
              <div class="flex items-center gap-4 shrink-0">
                <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    @click="updateQty(item, item.quantity - 1)"
                    class="px-2.5 py-1 text-slate-600 hover:bg-slate-200 transition-colors font-bold text-sm"
                  >-</button>
                  <span class="px-3 py-1 text-xs font-bold text-slate-900">{{ item.quantity }}</span>
                  <button
                    @click="updateQty(item, item.quantity + 1)"
                    class="px-2.5 py-1 text-slate-600 hover:bg-slate-200 transition-colors font-bold text-sm"
                  >+</button>
                </div>

                <div class="text-right min-w-[70px]">
                  <span class="font-extrabold text-slate-900 text-sm">${{ item.subtotal.toFixed(2) }}</span>
                </div>

                <button @click="cartStore.removeItem(item.id)" class="text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Checkout & Delivery Address Form -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between h-fit">
        <div>
          <h2 class="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Order Summary</h2>

          <div class="space-y-2.5 text-xs text-slate-600 mb-6">
            <div class="flex justify-between">
              <span>Items Subtotal:</span>
              <span class="font-bold text-slate-900">${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>B2B Optical Delivery Fee:</span>
              <span class="font-bold text-slate-900">$5.00</span>
            </div>
            <div class="pt-3 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Total Amount:</span>
              <span class="text-sky-600">${{ (cartStore.subtotal + 5.0).toFixed(2) }}</span>
            </div>
          </div>

          <!-- Shipping Address Form -->
          <div class="space-y-3 mb-6">
            <h3 class="text-xs font-bold text-slate-800">Delivery Information</h3>
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Store Shipping Address</label>
              <input
                v-model="shippingForm.shippingAddress"
                type="text"
                required
                placeholder="Street address & store location"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-semibold text-slate-500 mb-1">Province</label>
                <input
                  v-model="shippingForm.province"
                  type="text"
                  required
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-500 mb-1">District</label>
                <input
                  v-model="shippingForm.district"
                  type="text"
                  required
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Phone</label>
              <input
                v-model="shippingForm.phone"
                type="text"
                required
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Notes (Optional)</label>
              <input
                v-model="shippingForm.notes"
                type="text"
                placeholder="e.g. Call before delivery"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        <button
          @click="handleCheckout"
          :disabled="submitting || hasStockIssue"
          class="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {{ submitting ? 'Processing Order...' : 'Place B2B Order' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.store';
import { useOrderStore } from '@/stores/order.store';
import { useAuthStore } from '@/stores/auth.store';
import type { CartItem } from '@/types';
import { ShoppingCart, Trash2 } from 'lucide-vue-next';

const cartStore = useCartStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();
const router = useRouter();

const submitting = ref(false);

const shippingForm = reactive({
  shippingAddress: authStore.user?.retailer?.storeAddress || 'St 271, Sen Sok',
  province: authStore.user?.retailer?.province || 'Phnom Penh',
  district: authStore.user?.retailer?.district || 'Sen Sok',
  phone: authStore.user?.phone || '+85512999888',
  notes: '',
});

onMounted(() => {
  cartStore.fetchCart();
});

const getItemImage = (item: CartItem) => {
  if (item && item.product && item.product.images && item.product.images.length > 0) {
    return item.product.images[0].imageUrl;
  }
  return 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80';
};

const updateQty = (item: CartItem, newQty: number) => {
  if (newQty <= 0) {
    cartStore.removeItem(item.id);
  } else {
    cartStore.updateQuantity(item.id, newQty);
  }
};

const hasStockIssue = computed(() => {
  return cartStore.items.some((i) => i.isStockSufficient === false);
});

const handleCheckout = async () => {
  submitting.value = true;
  try {
    await orderStore.createOrder({
      shippingAddress: shippingForm.shippingAddress,
      province: shippingForm.province,
      district: shippingForm.district,
      phone: shippingForm.phone,
      notes: shippingForm.notes,
    });

    await cartStore.fetchCart();
    alert('🎉 B2B Order placed successfully! Live inventory reserved.');
    router.push('/retailer/orders');
  } catch (err: any) {
    alert(err.message || 'Failed to place order');
  } finally {
    submitting.value = false;
  }
};
</script>
