import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserCenter from '../views/UserCenter.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/userCenter',
    name: 'userCenter',
    component: UserCenter
  },
]
const router = createRouter({
history: createWebHistory(),
routes
})
export default router