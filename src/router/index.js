import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/home') },
      { path: 'qa', name: 'qa', component: () => import('@/views/qa') },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video')
      },
      { path: 'my', name: 'my', component: () => import('@/views/my') },
      {
        path: '/article/:articleId',
        name: 'article',
        component: () => import('@/views/article'),
        // 将路由动态参数映射到组件的 props 中，更推荐这种做法
        // 开启 props 传参
        props: true
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
