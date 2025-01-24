export default [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/homeView/homeView.vue')
  },
  {
    path: '/copyGeneration',
    name: 'copyGeneration',
    component: () => import('@/views/copyGeneration/copyGeneration.vue')
  },
  {
    path: '/intelligentSearch',
    name: 'intelligentSearch',
    component: () => import('@/views/intelligentSearch/intelligentSearch.vue')
  },
  {
    path: '/collectView',
    name: 'collectView',
    component: () => import('@/views/collectView/collectView.vue')
  }
]