import Vue from 'vue';
import Vuex from 'vuex';
import userState from './user';
import sysState from "./sys";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userState,
    sysState
  }
});