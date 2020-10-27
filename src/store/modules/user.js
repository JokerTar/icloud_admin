import { login, getUserInfo, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Model from '@/api/server/permission'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  userInfo: {},
  introduction: '',
  roles: []
}

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, verifyCode, vCodeToken } = userInfo
    return new Promise((resolve, reject) => {
      /*
      * userType admin登录为2
      * vcode: verifyCode, userType: 2
      * */
      login({ userName: username.trim(), passWord: password, vCode: verifyCode, userType: '2', vCodeToken }).then(response => {
        const { body } = response

        if (!body) {
          reject('Verification failed, please Login again.')
        }

        // 设置token
        commit('SET_TOKEN', body.accessToken)
        setToken(body.accessToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInfo({ commit }, state) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        if (res.ok === true) {
          commit('SET_USER_INFO', res.body)
          resolve(res)
        }
      })
    })
  },

  getMenu({ commit }, state) {
    return new Promise((resolve, reject) => {
      Model.menu().then(res => {
        const menus = res.map(item => {
          return item.menuCode
        })
        resolve(menus)
      })
    })
  },

  getMenuBtns({ commit }, menuCode) {
    return new Promise((resolve, reject) => {
      Model.menuBtns(menuCode).then(res => {
        resolve(res)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      //   commit('SET_TOKEN', '')
      //   commit('SET_ROLES', [])
      //   removeToken()
      //   resetRouter()
      //
      //   // reset visited views and cached views
      //   // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      //   dispatch('tagsView/delAllViews', null, { root: true })
      //
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })

      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      // const token = role + '-token'
      //
      // commit('SET_TOKEN', token)
      // setToken(token)

      // const { roles } = await dispatch('getInfo')
      const roles = [role]

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      // dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
