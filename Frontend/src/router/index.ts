import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/pages/LandingView.vue'),
    },

    // Auth Routes
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/pages/auth/LoginView.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/pages/auth/RegisterView.vue'),
          meta: { guestOnly: true },
        },
      ],
    },

    // Admin Routes
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, roles: ['SUPER_ADMIN'] },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/pages/admin/AdminDashboard.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/pages/admin/UsersView.vue'),
        },
        {
          path: 'wholesalers',
          name: 'admin-wholesalers',
          component: () => import('@/pages/admin/WholesalersView.vue'),
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('@/pages/admin/CategoriesView.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/pages/admin/AllProductsView.vue'),
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/pages/admin/AllOrdersView.vue'),
        },
      ],
    },

    // Wholesaler Routes
    {
      path: '/wholesaler',
      component: () => import('@/layouts/WholesalerLayout.vue'),
      meta: { requiresAuth: true, roles: ['WHOLESALER'] },
      children: [
        {
          path: '',
          name: 'wholesaler-dashboard',
          component: () => import('@/pages/wholesaler/WholesalerDashboard.vue'),
        },
        {
          path: 'products',
          name: 'wholesaler-products',
          component: () => import('@/pages/wholesaler/ProductsView.vue'),
        },
        {
          path: 'inventory',
          name: 'wholesaler-inventory',
          component: () => import('@/pages/wholesaler/InventoryView.vue'),
        },
        {
          path: 'orders',
          name: 'wholesaler-orders',
          component: () => import('@/pages/wholesaler/OrdersView.vue'),
        },
        {
          path: 'profile',
          name: 'wholesaler-profile',
          component: () => import('@/pages/wholesaler/ProfileView.vue'),
        },
      ],
    },

    // Retailer Routes
    {
      path: '/retailer',
      component: () => import('@/layouts/RetailerLayout.vue'),
      meta: { requiresAuth: true, roles: ['RETAILER'] },
      children: [
        {
          path: '',
          name: 'retailer-dashboard',
          component: () => import('@/pages/retailer/RetailerDashboard.vue'),
        },
        {
          path: 'products',
          name: 'retailer-products',
          component: () => import('@/pages/retailer/CatalogView.vue'),
        },
        {
          path: 'wholesalers',
          name: 'retailer-wholesalers',
          component: () => import('@/pages/retailer/WholesalersView.vue'),
        },
        {
          path: 'cart',
          name: 'retailer-cart',
          component: () => import('@/pages/retailer/CartView.vue'),
        },
        {
          path: 'orders',
          name: 'retailer-orders',
          component: () => import('@/pages/retailer/OrdersView.vue'),
        },
        {
          path: 'inventory',
          name: 'retailer-inventory',
          component: () => import('@/pages/retailer/InventoryView.vue'),
        },
        {
          path: 'profile',
          name: 'retailer-profile',
          component: () => import('@/pages/retailer/ProfileView.vue'),
        },
      ],
    },

    // 404 Catch All
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundView.vue'),
    },
  ],
});

// Navigation Guard for Authentication and RBAC
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.path === '/' && authStore.isAuthenticated) {
    if (authStore.isSuperAdmin) return next('/admin');
    if (authStore.isWholesaler) return next('/wholesaler');
    return next('/retailer');
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    if (authStore.isSuperAdmin) return next('/admin');
    if (authStore.isWholesaler) return next('/wholesaler');
    return next('/retailer');
  }

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next('/login');
    }

    const requiredRoles = to.meta.roles as string[];
    if (requiredRoles && !requiredRoles.includes(authStore.role || '')) {
      // Role not allowed, redirect appropriately
      if (authStore.isSuperAdmin) return next('/admin');
      if (authStore.isWholesaler) return next('/wholesaler');
      return next('/retailer');
    }
  }

  next();
});

export default router;
