import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/loginView/loginView.vue')
  }
]

const router = new VueRouter({
  routes
});
// 修改原型对联的push
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location, onComplete = () => { }, onAbort = () => { }) {
  return originalPush.call(this, location, onComplete, onAbort).catch(err => err)
};
export default router