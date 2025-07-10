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
    meta: { requiresAuth: true }
  },
  {
    path: "/reservations",
    component: () => import("./views/Reservations.vue"),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const isAuthRequired = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('token');
  //verify to do
  if (isAuthRequired && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
