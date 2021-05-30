import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import main_menu from '../views/main_menu.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: main_menu
  },
  {
    name: 'converting',
    path: '/coverting',
    component: () => import('../views/playlist.vue')
  },
  {
    name: 'playlist',
    path: '/playlist',
    component: () => import('../views/playlist.vue')
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
