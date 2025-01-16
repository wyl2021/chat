import { Local } from '@/utils/storage'
const userState = {
  state: {
    token: Local.get('token') || '',
    userInfo: Local.get('userInfo') ? JSON.parse(Local.get('userInfo')) : {}
  },
  actions: {
    setToken ({ commit }, value) {
      commit('setToken', value)
    },
    setUserInfo ({ commit }, value) {
      commit('setUserInfo', value)
    }
  },
  mutations: {
    setToken (state, value) {
      state.token = value;
      Local.set('token', value);
    },
    setUserInfo (state, value) {
      state.userInfo = value;
      Local.set('userInfo', JSON.stringify(value));
    }
  },
  getters: {
    getToken (state) {
      return state.token;
    },
    getUserInfo (state) {
      return state.userInfo;
    }
  }
}
export default userState