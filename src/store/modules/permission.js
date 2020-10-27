import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'
import { Notification } from 'element-ui'
import path from 'path'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => {
      return route.meta.roles.includes(role)
    })
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

function hasLeftSideRoute(router, fullPath) {
  // !fullPath.includes(router.redirect)
  if (!router.children) return

  const arr = fullPath.split('/')
  let fullPathName = ''
  if (arr && arr.length) {
    fullPathName = arr[arr.length - 1]
  }

  let child = null
  router.children.forEach(item => {
    if (item.path === fullPathName && fullPath.includes(item.leftSidebar)) {
      child = item
    }
  })

  if (router.leftSidebar
    && fullPath.includes(router.leftSidebar)
    && fullPathName
    && child
    && child.leftSidebar
    && fullPathName === child.path) {
    return router
  } else {
    return false
  }
}

/**
 * 过滤tabs路由导航
 * tabs需要额外添加activeName(选中状态)
 * **/
function hasTabsSideRoute(router, fullPath) {
  if (!router.children) return

  const arr = fullPath.split('/')
  let fullPathName = ''
  if (arr && arr.length) {
    fullPathName = arr[arr.length - 1]
  }

  let child = null
  router.children.forEach(item => {
    if (item.path === fullPathName && fullPath.includes(item.tabsSidebar)) {
      child = item
    }
  })

  if (router.tabsSidebar
    && fullPath.includes(router.tabsSidebar)
    && fullPathName
    && child
    && child.tabsSidebar
    && fullPathName === child.path) {
    store.dispatch('permission/addLeftSidebarRouters', {})
    return router
  } else {
    return false
  }
}

/**
 * 过滤tabs路由导航
 * tabs需要额外添加activeName(选中状态)
 * **/
function hasAuditSideRoute(router, fullPath) {
  if (!router.children) return

  const arr = fullPath.split('/')
  let fullPathName = ''
  if (arr && arr.length) {
    fullPathName = arr[arr.length - 1]
  }

  let child = null
  router.children.forEach(item => {
    if (item.path === fullPathName && fullPath.includes(item.auditSidebar)) {
      child = item
    }
  })

  if (router.auditSidebar
    && fullPath.includes(router.auditSidebar)
    && fullPathName
    && child
    && child.auditSidebar
    && fullPathName === child.path) {
    store.dispatch('permission/addLeftSidebarRouters', {})
    return router
  } else {
    return false
  }
}
/**
 * 添加左侧路由导航
 * 添加tabs路由导航
 * **/
function addSidebarRouters(routers, fullPath) {
  routers.forEach(item => {
    if (hasLeftSideRoute(item, fullPath)) {
      const tem = {
        basePath: item.path,
        ...item
      }

      store.dispatch('permission/addLeftSidebarRouters', tem)
    } else if (!item.hidden && item.children) {
      addSidebarRouters(item.children, fullPath)
    }

    if (hasTabsSideRoute(item, fullPath)) {
      const router = {
        basePath: item.path,
        ...item
      }

      store.dispatch('permission/addTabsSidebarRouters', { router, fullPath })
    } else if (!item.hidden && item.children) {
      addSidebarRouters(item.children, fullPath)
    }

    if (hasAuditSideRoute(item, fullPath)) {
      const router = {
        basePath: item.path,
        ...item
      }

      store.dispatch('permission/addAuditSidebarRouters', { router, fullPath })
    } else if (!item.hidden && item.children) {
      addSidebarRouters(item.children, fullPath)
    }
  })
}

/**
 * 递归路由
 * 修改所有路由的重定向位置
 * 包含子路由的重定向到第一个子路由
 * **/
function formatRedirect(routers, basePath = '/') {
  routers.map(item => {
    if (item.redirect && item.children && item.children.length) {
      item.redirect = path.resolve(path.resolve(basePath, item.path), item.children[0].path)

      formatRedirect(item.children, path.resolve(basePath, item.path))
    } else if (item.redirect && item.children && item.children.length === 0) {
      item.redirect = path.resolve(path.resolve(basePath, item.path), '')
    }
  })
}

const state = {
  routes: constantRoutes,
  selectRoute: null,
  addRoutes: [],
  leftSidebarRouters: {},
  tabsSidebarRouters: {},
  auditSidebarRouters: {},
  tabsActiveName: '',
  tabsActiveBackPath: '',
  auditTabs: 'bill'
}

const mutations = {
  SET_SELECT_TOUTE: (state, selectRoute) => {
    state.selectRoute = selectRoute
  },
  SET_AUDIT_TABS: (state, auditTabs) => {
    state.auditTabs = auditTabs
  },
  SET_AUDIT_SIDEBAR: (state, auditSidebarRouters) => {
    state.auditSidebarRouters = auditSidebarRouters
  },
  SET_TABS_ACTIVEBACK_PATH: (state, path) => {
    state.tabsActiveBackPath = path
  },
  SET_TABS_AVTIVENAME: (state, tabsActiveName) => {
    state.tabsActiveName = tabsActiveName
  },
  SET_CHILDROUTERS: (state, leftSidebarRouters) => {
    state.leftSidebarRouters = leftSidebarRouters
  },
  SET_TABS_SIDEBAR: (state, tabsSidebarRouters) => {
    state.tabsSidebarRouters = tabsSidebarRouters
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  addSelectRoute({ commit }, route) {
    commit('SET_SELECT_TOUTE', route)
  },
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      if (!roles || !roles.length) {
        Notification({
          dangerouslyUseHTMLString: true,
          message: `权限为空！`,
          type: 'error',
          duration: 5 * 1000
        })
        store.dispatch('user/logout')
        setTimeout(function() {
          window.location.href = '/'
        }, 2000)
        return
      }

      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      formatRedirect(accessedRoutes)

      // accessedRoutes.forEach(item => {
      //   if (item.redirect && item.path !== '*' && item.children) {
      //     const arr = item.redirect.split('/')
      //     arr[arr.length - 1] = item.children[0].path
      //     item.redirect = arr.join('/')
      //   } else {
      //     item.redirect = ''
      //   }
      // })
      resolve(accessedRoutes)
    })
  },
  setLeftSidebarRouters({ commit, state }, fullPath) {
    /**
    * 设置左侧路由列表、tabs路由列表
     * 先置空
     * 判断是否有左侧路由列表，有就添加
    * */
    commit('SET_CHILDROUTERS', null)
    commit('SET_TABS_SIDEBAR', null)
    commit('SET_AUDIT_SIDEBAR', null)

    addSidebarRouters(state.routes, fullPath)
  },
  addLeftSidebarRouters({ commit }, router) {
    /**
     * 添加左侧路由列表
     * **/

    commit('SET_CHILDROUTERS', router)
  },
  addTabsSidebarRouters({ commit }, { router, fullPath }) {
    // 添加tabs路由列表
    commit('SET_TABS_SIDEBAR', router)

    // tabs需要额外添加activeName(选中状态)
    const path = fullPath.split('/')
    const activeName = path[path.length - 1]
    commit('SET_TABS_AVTIVENAME', activeName)
  },
  addAuditSidebarRouters({ commit }, { router, fullPath }) {
    commit('SET_AUDIT_SIDEBAR', router)

    const path = fullPath.split('/')
    const activeName = path[path.length - 1]
    commit('SET_TABS_AVTIVENAME', activeName)
  },
  setAuditTabs({ commit }, tabs) {
    commit('SET_AUDIT_TABS', tabs)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
