import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginView.vue';
import { isAuthenticated } from '@/auth.js';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },

  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import(/* webpackChunkName: "signIn" */ '../views/RegisterView.vue'),
  },

  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/HomeView.vue'),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        // User is authenticated, allow access to the home page
        console.log('User is authenticated');
        next();
      }
      else {
        // User is not authenticated, redirect to the login page
        console.log('User is not authenticated, redirecting to login');
        next('/login');
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
