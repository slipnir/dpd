import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router';
import UserTable from '@/components/UserTable.vue';

const routes = [
  {
    path: '/',
    name: 'UserTable',
    component: UserTable,
    props: (route: RouteLocationNormalized) => {
      const search = Array.isArray(route.query.search)
          ? route.query.search[0]
          : route.query.search || '';

      const currentPage = Array.isArray(route.query.page)
          ? Number(route.query.page[0])
          : Number(route.query.page) || 1;

      return {
        searchQuery: search,
        currentPage,
      };
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
