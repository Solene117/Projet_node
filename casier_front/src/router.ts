import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: "/", component: () => import("./views/Accueil.vue") },
  { path: "/login", component: () => import("./views/Login.vue") },
  { path: "/register", component: () => import("./views/Register.vue") },
  { path: '/forgot-password', component: () => import('./views/ForgotPassword.vue') },
  { path: '/reset-password', component: () => import('./views/ResetPassword.vue') },
  { path: '/logout', component: () => import('./views/Logout.vue') },
  { path: "/lockers", component: () => import("./views/Lockers.vue") },
  {
    path: "/reservations",
    component: () => import("./views/Reservations.vue"),
  },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router; 