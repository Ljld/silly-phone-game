import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'game',
    component: () => import('./pages/GamePage.vue'),
  },
  {
    path: '/city',
    name: 'city',
    component: () => import('./pages/CityPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
