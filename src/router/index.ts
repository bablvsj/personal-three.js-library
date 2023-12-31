/* eslint-disable prettier/prettier */
import { createWebHashHistory, createRouter } from 'vue-router'
/* Layout */
// import Layout from '@/layout'
/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    // will match everything
    path: '/:catchAll(.*)',
    component: () => import('@/views/404.vue')
  },
  {
    path: '/home',
    name: 'Home',
    hidden: true,
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect:"/index",
    children: [
      {
        path: '/textureMapping',
        name: 'TextureMapping',
        component: () => import('@/views/basic/textureMapping.vue'),
        hidden: true
      },
      {
        path: '/index',
        name: 'SystemIndex',
        component: () => import('@/views/system/index.vue'),
        hidden: true
      },
      {
        path: '/basicB',
        name: 'BasicB',
        component: () => import('@/views/basic/B.vue'),
        hidden: true
      },
      {
        path: '/basicC',
        name: 'BasicC',
        component: () => import('@/views/basic/C.vue'),
        hidden: true
      },
      {
        path: '/lightShadow',
        name: 'LightShadow',
        component: () => import('@/views/basic/lightShadow.vue'),
        hidden: true
      },
      {
        path: '/basicE',
        name: 'BasicE',
        component: () => import('@/views/basic/E.vue'),
        hidden: true
      },
      {
        path: '/basicF',
        name: 'BasicF',
        component: () => import('@/views/basic/F.vue'),
        hidden: true
      },
      {
        path: '/basicG',
        name: 'BasicG',
        component: () => import('@/views/basic/G.vue'),
        hidden: true
      },
      {
        path: '/basicH',
        name: 'BasicH',
        component: () => import('@/views/basic/H.vue'),
        hidden: true
      },
      {
        path: '/basicI',
        name: 'BasicI',
        component: () => import('@/views/basic/I.vue'),
        hidden: true
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
      },
      {
        path: '/eightA',
        name: 'EightA',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Eight/A.vue')
      },
      {
        path: '/eightB',
        name: 'EightB',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Eight/B.vue')
      },
      {
        path: '/eightC',
        name: 'EightC',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Eight/C.vue')
      },
      {
        path: '/groupCar',
        name: 'GroupCar',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/basic/groupCar.vue')
      },
      {
        path: '/groupCarPlus',
        name: 'GroupCarPlus',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/basic/groupCarPlus.vue')
      },
      {
        path: '/orthographicCamera',
        name: 'OrthographicCamera',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/basic/orthographicCamera.vue')
      }
    ]
  },
  {
    path: '/cool',
    component: () => import('@/layout/index.vue'),
    // redirect:"/index",
    children: [
      {
        path: 'mechine',
        name: 'Mechine',
        component: () => import('@/views/coolModels/mechine.vue'),
        hidden: true
      },
      {
        path: 'freeFall',
        name: 'FreeFall',
        component: () => import('@/views/coolModels/freeFall.vue'),
        hidden: true
      },
    ]
  },
  {
    path: '/journey',
    component: () => import('@/layout/index.vue'),
    // redirect:"/index",
    children: [
      {
        path: 'demo',
        name: 'Mechine',
        component: () => import('@/views/journey/A.vue'),
        hidden: true
      }
    ]
  }
 
]

const addLayoutToRoute = (route, parentLayout = 'default') => {
  route.meta = route.meta || {}
  route.meta.layout = route.layout || parentLayout

  if (route.children) {
    route.children = route.children.map((childRoute) =>
      addLayoutToRoute(childRoute, route.meta.layout)
    )
  }
  return route
}

// constantRoutes = constantRoutes.map((route) => addLayoutToRoute(route))

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        top: 0
      }
    }
  }
})

export default router
