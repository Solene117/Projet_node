import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("./views/Accueil.vue") },
  { path: "/login",
    component: () => import("./views/Login.vue"),
    meta: { hideLoginButton: true }
  },
  { path: '/forgot-password',
    component: () => import('./views/ForgotPassword.vue'),
    meta: { hideLoginButton: true }
  },
  { path: '/reset-password',
    component: () => import('./views/ResetPassword.vue'),
    meta: { hideLoginButton: true }
  },
  { path: '/logout',
    component: () => import('./views/Logout.vue'),
    meta: { requiresAuth: true, hideLoginButton: true }
  },
  { path: "/register",
    component: () => import("./views/Register.vue"),
    meta: { hideLoginButton: true }
  },
  { 
    path: "/lockers", 
    component: () => import("./views/Lockers.vue"),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: "/reservations",
    component: () => import("./views/Reservations.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/payment",
    component: () => import("./views/Payment.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/payment-success",
    component: () => import("./views/PaymentSuccess.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/payment-cancel",
    component: () => import("./views/PaymentCancel.vue"),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isAuthRequired = to.matched.some(record => record.meta.requiresAuth);
  const isAdminRequired = to.matched.some(record => record.meta.requiresAdmin);
  const token = localStorage.getItem('token');
  
  if (isAuthRequired && !token) {
    next('/login');
    return;
  }
  
  if (isAdminRequired && token) {
    try {
      const res = await fetch('http://localhost:3033/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const user = await res.json();
      
      if (user.role !== 'admin') {
        next('/');
        return;
      }
    } catch {
      next('/login');
      return;
    }
  }
  
  next();
});

export default router;
