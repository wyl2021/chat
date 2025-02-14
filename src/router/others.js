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
    path: '/imageGeneration',
    name: 'imageGeneration',
    component: () => import('@/views/imageGeneration/imageGeneration.vue')
  },
  {
    path: '/filmGeneration',
    name: 'filmGeneration',
    component: () => import('@/views/filmGeneration/filmGeneration.vue')
  },
  {
    path: '/collectView',
    name: 'collectView',
    component: () => import('@/views/collectView/collectView.vue')
  },
  {
    path: '/recentlyGenerated',
    name: 'recentlyGenerated',
    component: () => import('@/views/recentlyGenerated/recentlyGenerated.vue')
  },{
    path: '/knowledgeBase',
    name: 'knowledgeBase',
    component: () => import('@/views/knowledgeBase/knowledgeBase.vue')
  },
  {
    path: '/baseDetails',
    name: 'baseDetails',
    component: () => import('@/views/knowledgeBase/baseDetails.vue')
  },
  
]