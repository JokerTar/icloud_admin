const state = {
  process: {},
  iframeUrl: '',
  layoutUrl: '',
  auditQuery: {}
}

const mutations = {
  SET_PROCESS_DATA: (state, process) => {
    state.process = process
  },
  SER_IFRAME_URL: (state, iframeUrl) => {
    state.iframeUrl = iframeUrl
  },
  SER_LAYOUT_URL: (state, layoutUrl) => {
    state.layoutUrl = layoutUrl
  },
  SET_AUDIT_QUERY: (state, auditQuery) => {
    state.auditQuery = auditQuery
  }
}

const actions = {
  getProcess({ commit }, process) {
    commit('SET_PROCESS_DATA', process)
  },
  getIframeUrl({ commit }, iframeUrl) {
    commit('SER_IFRAME_URL', iframeUrl)
  },
  getLayoutUrl({ commit }, layoutUrl) {
    commit('SER_LAYOUT_URL', layoutUrl)
  },
  getAuditQuery({ commit }, auditQuery) {
    commit('SET_AUDIT_QUERY', auditQuery)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
