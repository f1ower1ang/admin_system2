import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '系统概况', icon: 'dashboard' }
    }, {
      path: '401',
      name: '401',
      component: () => import('@/views/401'),
      hidden: true,
      meta: { title: '无权限' }
    }]
  },

  {
    path: '/emailManage',
    meta: { title: '邮件管理', icon: 'manage' },
    component: Layout,
    children: [{
      path: '',
      name: 'emailManage',
      component: () => import('@/views/emailManage/index'),
      meta: { title: '邮件管理' }
    }, {
      path: 'attach',
      name: 'attachManage',
      component: () => import('@/views/emailManage/attach'),
      meta: { title: '附件管理' }
    }, {
      path: '/statisticAnalysis',
      name: 'StatisticAnalysis',
      component: () => import('@/views/emailManage/statisticAnalysis')
    }, {
      path: '/getReport',
      name: 'GetReport',
      component: () => import('@/views/emailManage/getReport')
    }, {
      path: '/victimUploadMany',
      name: 'Victim-uploadMany',
      component: () => import('@/views/ruleManage/victim-uploadMany'),
      meta: { getApt: true },
      hidden: true
    }]
  },

  {
    path: '/emailTrace',
    meta: { title: '同源分析', icon: 'trace' },
    component: Layout,
    children: [{
      path: '',
      name: 'traceOrder',
      component: () => import('@/views/emailTrace/index'),
      meta: { title: '分析任务', getApt: true }
    }, {
      path: 'record',
      name: 'traceRecord',
      component: () => import('@/views/emailTrace/record'),
      meta: { title: '分析记录' }
    }]
  },

  {
    path: '/ruleManage',
    meta: { title: '规则管理', icon: 'rule' },
    component: Layout,
    children: [{
      path: '',
      name: 'ruleDefinition',
      component: () => import('@/views/ruleManage/index'),
      meta: { title: '规则定义' }
    }, {
      path: 'sourceImport',
      name: 'sourceImport',
      component: () => import('@/views/ruleManage/sourceImport'),
      meta: { title: '源数据导入', getApt: true }
    }, {
      path: 'groupManage',
      name: 'groupManage',
      component: () => import('@/views/ruleManage/groupManage'),
      meta: { title: '组织管理' }
    }, {
      path: 'targetManage',
      name: 'targetManage',
      component: () => import('@/views/ruleManage/targetManage'),
      meta: { title: '受害目标管理' }
    }]
  },

  {
    path: '/userManage',
    meta: { title: '用户管理', icon: 'user' },
    component: Layout,
    children: [{
      path: '',
      name: 'accountManage',
      component: () => import('@/views/userManage/index'),
      meta: { title: '帐户管理' }
    }, {
      path: 'permissionManage',
      name: 'permissionManage',
      component: () => import('@/views/userManage/permissionManage'),
      meta: { title: '资源管理' }
    }, {
      path: 'roleManage',
      name: 'roleManage',
      component: () => import('@/views/userManage/roleManage'),
      meta: { title: '角色管理' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
