import defaultSettings from '@/settings'

const { showSettings, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  resetPwd: false
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  RESET_PWD: (state, flag) => {
    state.resetPwd = flag
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  showDialog({ commit }, flag) {
    commit('RESET_PWD', flag)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

