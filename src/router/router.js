import Vue from 'vue';
import VueRouter from 'vue-router';
import LayoutView from "@/components/LayoutView/LayoutView.vue";
import others from "./others.js";
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'LayoutView',
    component: LayoutView,
    redirect: '/home',
    children: [...others]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/loginView/loginView.vue')
  }
]

const router = new VueRouter({
  routes
});

export default router