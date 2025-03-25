
const styleState = {
  state: {
   theme:'dark'
  },
  actions: {
    setTheme ({ commit }, value) {
      commit('setTheme', value)
    },
  },
  mutations: {
    setTheme (state, value) {
      state.theme = value;

    },
  },
  getters: {
    getTheme (state) {
      return state.theme;
    }
  }
}

export default styleState