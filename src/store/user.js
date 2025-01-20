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
    },
    // 退出登录
  logout({ commit },router) {
    commit('clearUserInfo');  // 清空 token 和用户信息
    router.push('/login');
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
    },
    // 清空用户信息和 token
  clearUserInfo() {
    Local.remove('token');
    Local.remove('userInfo');
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