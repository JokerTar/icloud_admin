import Cookies from 'js-cookie'
import store from '@/store'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  sidebarMode: 'topbar', // horizontal 顶部水平模式, vertical 侧边栏模式, topbar 商业保理平台原有模式
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  leftSidebarRouters: {},
  showSideTool: false,
  isCollapse: false
}

const mutations = {
  SET_COLLAPSE: (state, isCollapse) => {
    state.isCollapse = isCollapse
  },
  SET_SIDE_TOOL: (state, flag) => {
    state.showSideTool = flag
  },
  SET_SIDEBARMODE: (state, sidebarMode) => {
    state.sidebarMode = sidebarMode
  },
  SET_CHILDROUTERS: (state, leftSidebarRouters) => {
    state.leftSidebarRouters = leftSidebarRouters
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  }
}

const actions = {
  toggleCollapse({ commit }, flag) {
    commit('SET_COLLAPSE', flag)
  },
  toggleSideToll({ commit }, flag) {
    commit('SET_SIDE_TOOL', flag)
  },
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setLeftSidebarRouters({ commit }, leftSidebarRouters) {
    commit('SET_CHILDROUTERS', leftSidebarRouters)
  },
  setSidebarMode({ commit }, sidebarMode) {
    commit('SET_SIDEBARMODE', sidebarMode)
  },
  hiddenChgInfo() {
    return new Promise((resolve, reject) => {
      store.dispatch('user/changeRoles', 'env').then(() => {
        resolve()
      })
    })
  },
  showChgInfo({ commit }) {
    return new Promise((resolve, reject) => {
      store.dispatch('user/changeRoles', 'chgInfo').then(() => {
        resolve()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
