import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("./views/Accueil.vue") },
  { path: "/login", component: () => import("./views/Login.vue") },
  { path: "/register", component: () => import("./views/Register.vue") },
  { path: "/lockers", component: () => import("./views/Lockers.vue") },
  {
    path: "/reservations",
    component: () => import("./views/Reservations.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
