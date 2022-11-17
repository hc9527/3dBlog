import { createRouter, createWebHistory } from 'vue-router'
import { request } from '@/plugins/axios/index'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 路由变化时取消当前所有非全局的pending状态的请求
  request.clearPendingPool()
  next()
})

export default router
