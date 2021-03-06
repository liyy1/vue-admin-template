import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.role) { // 判断是否已拉取完user_info信息
        next()
      } else { // 如果store中不存在用户信息，重新拉取并更新路由
        store.dispatch('GetUserInfo').then(res => {
          const menus = res.data.menus
          router.addRoutes(GenerateRoutes(menus)) // 动态添加路由
          // 初始路由不要加重定向到404路由，否则beforeEach时地址已经变成/404了，而不是刷新之前的页面的地址
          // 要在每次动态添加路由的时候加上
          router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
          next({ ...to, replace: true })
        })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

// 动态添加路由
function GenerateRoutes(menus) {
  const ms = []
  for (const menu of menus) {
    const m = {}
    m.grade = 1
    m.name = (menu.children.length > 1) ? menu.name : undefined
    m.path = '/' + menu.path
    m.redirect = menu.redirect
    m.component = () => import('@/views/admin/Layout')
    m.meta = { title: menu.name, icon: menu.icon }
    m.children = GenerateRoutes2(menu.children)
    router.options.routes.push(m)
    ms.push(m)
  }
  return ms
}

function GenerateRoutes2(menus) {
  const ms = []
  for (const menu of menus) {
    const m = {}
    m.name = menu.name
    m.path = menu.path
    m.redirect = menu.redirect
    m.component = () => import('@/views/' + menu.url)
    m.meta = { title: menu.name, icon: menu.icon }
    const children = GenerateRoutes3(menu.children)
    if (children.length > 0) {
      m.children = children
    }
    ms.push(m)
  }
  return ms
}

function GenerateRoutes3(menus) {
  const ms = []
  for (const menu of menus) {
    if (menu.type === 3) {
      const m = {}
      m.hidden = true
      m.name = menu.name
      m.path = menu.path
      m.meta = { title: menu.name }
      m.component = () => import('@/views/' + menu.url)
      ms.push(m)
    }
  }
  return ms
}
