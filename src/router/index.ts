import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import ('../views/Home.vue'),
    

  },
  {
    path: '/accounts',
    component: () => import ('../views/Accounts.vue')
  },
  {
    path: '/operation',
    component: () => import ('../views/NewOperation.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
