import { Local } from '@/utils/storage'
const sysState = {
  state: {
    activePath: Local.get('activePath') || '/home',
  },
  actions: {
    setActivePath ({ commit }, value) {
      commit('setActivePath', value)
    },
  },
  mutations: {
    setActivePath (state, value) {
      state.activePath = value;
      Local.set('activePath', value);
    },
  },
  getters: {
    getActivePath (state) {
      return state.activePath;
    }
  }
}

export default sysState