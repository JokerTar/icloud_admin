const state = {
  htmlData: ''
}

const mutations = {
  SET_HTML_DATA: (state, htmlData) => {
    state.htmlData = htmlData
  }
}

const actions = {
  getHtmlData({commit}, htmlData) {
    commit('SET_HTML_DATA', htmlData)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
