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
  }
]