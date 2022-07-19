import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login'

Vue.use(VueRouter)

// 路由页面懒加载
// 需要哪个页面再去请求哪个页面

const routes = [
  {
    path: '/login',
    // component:Login,
    component: () => import('@/views/Login')
  },
  {
    path: '/',
    component: () => import('@/views/Layout'),
    redirect: '/ ',
    children: [
      {
        path: '/ ',
        component: () => import('@/views/Home')
      },
      {
        path: '/video',
        component: () => import('@/views/Video')
      },
      {
        path: '/qa',
        component: () => import('@/views/QA')
      },
      {
        path: '/profile',
        component: () => import('@/views/My')
      }
    ]
  },
  {
    path: '/search',
    component: () => import('@/views/Search')
  }
]

const router = new VueRouter({
  routes
})

export default router
