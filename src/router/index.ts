import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import mainMenu from "../views/main_menu.vue";

const routes: Array<RouteRecordRaw> = [
  {
    name: "home",
    path: "/",
    component: mainMenu,
  },
  {
    name: "converting",
    path: "/converting",
    component: () => import("../views/converting.vue"),
  },
  {
    name: "sorting",
    path: "/sorting",
    component: () => import("../views/sorting.vue"),
  },
  {
    name: "playlist",
    path: "/playlist",
    component: () => import("../views/playlist.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
